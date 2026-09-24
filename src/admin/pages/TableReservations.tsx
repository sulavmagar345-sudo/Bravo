import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import {
  fetchResourcesByType,
  createResource,
  updateResource,
  archiveResource,
  setResourceStatus,
  markResourceAvailable,
  markResourceOccupied,
} from '../services/resources';
import {
  fetchBlockedTimesByType,
  createBlockedTime,
  deleteBlockedTime,
} from '../services/blocked-times';
import type { Resource, ResourceStatus, BlockedTime } from '../types';

export const TableReservations: React.FC = () => {
  const [tables, setTables] = useState<Resource[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showConfirmArchive, setShowConfirmArchive] = useState(false);
  const [activeTable, setActiveTable] = useState<Resource | null>(null);

  // Add Form State
  const [addName, setAddName] = useState('');
  const [addCapacity, setAddCapacity] = useState('4');
  const [addStatus, setAddStatus] = useState<ResourceStatus>('available');
  const [addError, setAddError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editCapacity, setEditCapacity] = useState('4');
  const [editStatus, setEditStatus] = useState<ResourceStatus>('available');
  const [editError, setEditError] = useState<string | null>(null);

  // Block Time Form State
  const [blockResourceId, setBlockResourceId] = useState('');
  const [blockDate, setBlockDate] = useState('');
  const [blockStart, setBlockStart] = useState('14:00');
  const [blockEnd, setBlockEnd] = useState('17:00');
  const [blockReason, setBlockReason] = useState('Private Event');
  const [blockError, setBlockError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [tableList, blocks] = await Promise.all([
        fetchResourcesByType('table'),
        fetchBlockedTimesByType('table'),
      ]);
      setTables(tableList);
      setBlockedTimes(blocks);
      setError(null);
    } catch (err: any) {
      setError('Failed to load table reservations data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function showMessage(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  }

  // Summary counts
  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const pausedCount = tables.filter((t) => t.status === 'paused').length;

  // Quick Action: Mark Available
  async function handleMarkAvailable(table: Resource) {
    try {
      const updated = await markResourceAvailable(table.id);
      setTables((prev) => prev.map((t) => (t.id === table.id ? { ...t, status: 'available', active: true } : t)));
      showMessage(`${table.name} is now AVAILABLE for new reservations.`);
    } catch (err: any) {
      alert('Failed to mark table available: ' + err.message);
    }
  }

  // Quick Action: Mark Occupied
  async function handleMarkOccupied(table: Resource) {
    try {
      const updated = await markResourceOccupied(table.id);
      setTables((prev) => prev.map((t) => (t.id === table.id ? { ...t, status: 'occupied', active: true } : t)));
      showMessage(`${table.name} is now OCCUPIED.`);
    } catch (err: any) {
      alert('Failed to mark table occupied: ' + err.message);
    }
  }

  // Quick Action: Toggle Pause / Activate
  async function handleTogglePause(table: Resource) {
    const isPaused = table.status === 'paused';
    const nextStatus: ResourceStatus = isPaused ? 'available' : 'paused';
    try {
      await setResourceStatus(table.id, nextStatus);
      setTables((prev) =>
        prev.map((t) => (t.id === table.id ? { ...t, status: nextStatus, active: nextStatus === 'available' } : t))
      );
      showMessage(`${table.name} is now ${nextStatus === 'available' ? 'AVAILABLE' : 'PAUSED'}.`);
    } catch (err: any) {
      alert('Failed to update table status: ' + err.message);
    }
  }

  // Open Edit Modal
  function handleOpenEdit(table: Resource) {
    setActiveTable(table);
    setEditName(table.name);
    setEditCapacity(table.capacity.toString());
    setEditStatus(table.status || (table.active ? 'available' : 'paused'));
    setEditError(null);
    setShowEditModal(true);
  }

  // Save Edit
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTable) return;

    const trimmedName = editName.trim();
    const cap = parseInt(editCapacity, 10);

    if (!trimmedName) {
      setEditError('Table name is required.');
      return;
    }
    if (isNaN(cap) || cap < 1 || cap > 6) {
      setEditError('Please enter a valid guest capacity between 1 and 6.');
      return;
    }

    const isDuplicate = tables.some(
      (t) =>
        t.id !== activeTable.id &&
        t.name.toLowerCase().trim() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setEditError('A table with this name already exists.');
      return;
    }

    setActionLoading(true);
    setEditError(null);

    try {
      await updateResource(activeTable.id, {
        name: trimmedName,
        capacity: cap,
        status: editStatus,
        active: editStatus === 'available' || editStatus === 'occupied',
      });
      setTables((prev) =>
        prev.map((t) =>
          t.id === activeTable.id
            ? { ...t, name: trimmedName, capacity: cap, status: editStatus, active: editStatus === 'available' || editStatus === 'occupied' }
            : t
        )
      );
      setShowEditModal(false);
      showMessage(`Updated ${trimmedName} successfully.`);
    } catch (err: any) {
      setEditError(err.message || 'Failed to save changes.');
    } finally {
      setActionLoading(false);
    }
  }

  // Add Table
  async function handleAddTable(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = addName.trim();
    const cap = parseInt(addCapacity, 10);

    if (!trimmedName) {
      setAddError('Table name is required.');
      return;
    }
    if (isNaN(cap) || cap < 1 || cap > 6) {
      setAddError('Please enter a valid guest capacity between 1 and 6.');
      return;
    }

    const isDuplicate = tables.some(
      (t) => t.name.toLowerCase().trim() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setAddError('A table with this name already exists.');
      return;
    }

    setActionLoading(true);
    setAddError(null);

    try {
      const created = await createResource({
        type: 'table',
        name: trimmedName,
        capacity: cap,
        status: addStatus,
        active: addStatus === 'available',
      });
      setTables((prev) => [...prev, created]);
      setShowAddModal(false);
      setAddName('');
      setAddCapacity('4');
      setAddStatus('available');
      showMessage(`Added ${trimmedName} successfully.`);
    } catch (err: any) {
      setAddError(err.message || 'Failed to add table.');
    } finally {
      setActionLoading(false);
    }
  }

  // Remove Table (Archive)
  async function handleArchiveTable() {
    if (!activeTable) return;
    setActionLoading(true);
    try {
      await archiveResource(activeTable.id);
      setTables((prev) => prev.filter((t) => t.id !== activeTable.id));
      setShowConfirmArchive(false);
      setShowEditModal(false);
      showMessage(`${activeTable.name} has been removed from future availability. Existing booking records remain intact.`);
      setActiveTable(null);
    } catch (err: any) {
      alert('Failed to remove table: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // Block Time
  async function handleCreateBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!blockResourceId || !blockDate || !blockStart || !blockEnd) {
      setBlockError('Please fill in all required date and time fields.');
      return;
    }

    const startsAt = new Date(`${blockDate}T${blockStart}:00`).toISOString();
    const endsAt = new Date(`${blockDate}T${blockEnd}:00`).toISOString();

    if (new Date(endsAt) <= new Date(startsAt)) {
      setBlockError('End time must be after start time.');
      return;
    }

    setActionLoading(true);
    setBlockError(null);

    try {
      const newBlock = await createBlockedTime({
        resource_id: blockResourceId,
        starts_at: startsAt,
        ends_at: endsAt,
        reason: blockReason.trim() || null,
      });

      setBlockedTimes((prev) => [newBlock, ...prev]);
      setShowBlockModal(false);
      setBlockReason('Private Event');
      showMessage('Blocked time created. This interval is now unavailable for public reservations.');
    } catch (err: any) {
      setBlockError(err.message || 'Failed to create blocked time.');
    } finally {
      setActionLoading(false);
    }
  }

  // Unblock Time
  async function handleUnblock(id: string) {
    if (!window.confirm('Are you sure you want to unblock this period?')) return;
    try {
      await deleteBlockedTime(id);
      setBlockedTimes((prev) => prev.filter((b) => b.id !== id));
      showMessage('Blocked period removed.');
    } catch (err: any) {
      alert('Failed to unblock period: ' + err.message);
    }
  }

  return (
    <div className="admin-page-container">
      <PageHeader
        title="Table Reservations"
        subtitle="Control which tables are physically available for reservations. You decide when a table is released."
        action={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setBlockResourceId(tables[0]?.id || '');
                setBlockDate(new Date().toLocaleDateString('en-CA'));
                setBlockError(null);
                setShowBlockModal(true);
              }}
              className="admin-btn admin-btn--secondary"
              disabled={tables.length === 0}
            >
              Block Time
            </button>
            <button
              onClick={() => {
                setAddName('');
                setAddCapacity('4');
                setAddStatus('available');
                setAddError(null);
                setShowAddModal(true);
              }}
              className="admin-btn admin-btn--primary"
            >
              + Add Table
            </button>
          </div>
        }
      />

      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {successMsg && <div className="admin-alert admin-alert--success">{successMsg}</div>}

      {/* Summary Counters */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
        <div className={`admin-stat-card ${availableCount > 0 ? 'admin-stat-card--highlight' : ''}`}>
          <div className="admin-stat-card__label">Available Tables</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : `${availableCount} / ${tables.length}`}
          </div>
        </div>
        <div className={`admin-stat-card ${occupiedCount > 0 ? 'admin-stat-card--highlight' : ''}`}>
          <div className="admin-stat-card__label">Occupied Tables</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : `${occupiedCount} / ${tables.length}`}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Paused Tables</div>
          <div className="admin-stat-card__value">{loading ? '-' : pausedCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Scheduled Blocks</div>
          <div className="admin-stat-card__value">{loading ? '-' : blockedTimes.length}</div>
        </div>
      </div>

      {/* Tables List Card */}
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <div className="admin-card__header">
          <div>
            <h3 className="admin-card__title">Table Inventory</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              When a guest reserves or sits down, mark it <strong>Occupied</strong>. When they finish and leave, click <strong>Mark Available</strong>.
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            {tables.length} table{tables.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="admin-card__body" style={{ padding: 0 }}>
          {loading ? (
            <div className="admin-empty">Loading tables...</div>
          ) : tables.length === 0 ? (
            <div className="admin-empty">
              <p>No tables configured yet.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="admin-btn admin-btn--secondary admin-btn--sm"
                style={{ marginTop: '12px' }}
              >
                + Add your first table
              </button>
            </div>
          ) : (
            <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Table Name</th>
                    <th>Capacity</th>
                    <th>Physical Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table) => {
                    const status = table.status || (table.active ? 'available' : 'paused');
                    return (
                      <tr key={table.id}>
                        <td>
                          <strong style={{ fontSize: '0.95rem' }}>{table.name}</strong>
                        </td>
                        <td>
                          <span style={{ color: 'var(--admin-text-muted)' }}>
                            {table.capacity} {table.capacity === 1 ? 'guest' : 'guests'}
                          </span>
                        </td>
                        <td>
                          {status === 'available' && (
                            <span
                              className="admin-badge"
                              style={{
                                background: 'rgba(34, 197, 94, 0.15)',
                                color: '#16a34a',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                fontWeight: 600,
                              }}
                            >
                              ● AVAILABLE
                            </span>
                          )}
                          {status === 'occupied' && (
                            <span
                              className="admin-badge"
                              style={{
                                background: 'rgba(234, 88, 12, 0.15)',
                                color: '#ea580c',
                                border: '1px solid rgba(234, 88, 12, 0.3)',
                                fontWeight: 600,
                              }}
                            >
                              ○ OCCUPIED
                            </span>
                          )}
                          {status === 'paused' && (
                            <span
                              className="admin-badge"
                              style={{
                                background: 'rgba(100, 116, 139, 0.12)',
                                color: '#64748b',
                                border: '1px solid rgba(100, 116, 139, 0.25)',
                                fontWeight: 600,
                              }}
                            >
                              ○ PAUSED
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div
                            className="admin-table__actions"
                            style={{ justifyContent: 'flex-end', gap: '6px' }}
                          >
                            {status === 'occupied' && (
                              <button
                                onClick={() => handleMarkAvailable(table)}
                                className="admin-btn admin-btn--primary admin-btn--sm"
                                title="Customer has finished. Make this table bookable again."
                              >
                                Mark Available
                              </button>
                            )}

                            {status === 'available' && (
                              <button
                                onClick={() => handleMarkOccupied(table)}
                                className="admin-btn admin-btn--secondary admin-btn--sm"
                                title="Mark table as currently seated/occupied."
                              >
                                Mark Occupied
                              </button>
                            )}

                            {status === 'paused' ? (
                              <button
                                onClick={() => handleTogglePause(table)}
                                className="admin-btn admin-btn--primary admin-btn--sm"
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleTogglePause(table)}
                                className="admin-btn admin-btn--secondary admin-btn--sm"
                              >
                                Pause
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenEdit(table)}
                              className="admin-btn admin-btn--secondary admin-btn--sm"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Blocked Times Section */}
      <div className="admin-card">
        <div className="admin-card__header">
          <div>
            <h3 className="admin-card__title">Scheduled Blocked Times</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              Periods when a table is temporarily unavailable for events, maintenance, or private reservations.
            </p>
          </div>
          <button
            onClick={() => {
              setBlockResourceId(tables[0]?.id || '');
              setBlockDate(new Date().toLocaleDateString('en-CA'));
              setBlockError(null);
              setShowBlockModal(true);
            }}
            className="admin-btn admin-btn--secondary admin-btn--sm"
            disabled={tables.length === 0}
          >
            + Block Period
          </button>
        </div>

        <div className="admin-card__body" style={{ padding: 0 }}>
          {blockedTimes.length === 0 ? (
            <div className="admin-empty" style={{ padding: '32px 16px' }}>
              <p>No blocked times currently active for tables.</p>
            </div>
          ) : (
            <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Table</th>
                    <th>Date</th>
                    <th>Time Window</th>
                    <th>Reason</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blockedTimes.map((block) => {
                    const startDate = new Date(block.starts_at);
                    const endDate = new Date(block.ends_at);
                    const dateStr = startDate.toLocaleDateString('en-NP', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    const timeStr = `${startDate.toLocaleTimeString('en-NP', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })} – ${endDate.toLocaleTimeString('en-NP', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}`;
                    const resName =
                      block.resource?.name ||
                      tables.find((t) => t.id === block.resource_id)?.name ||
                      'Table';

                    return (
                      <tr key={block.id}>
                        <td>
                          <strong>{resName}</strong>
                        </td>
                        <td>{dateStr}</td>
                        <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                          {timeStr}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem' }}>{block.reason || '—'}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleUnblock(block.id)}
                            className="admin-btn admin-btn--danger admin-btn--sm"
                          >
                            Unblock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL: ADD TABLE ─────────────────────────────────── */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="admin-modal__title">Add New Table</h3>
            <p className="admin-modal__body" style={{ marginBottom: '16px' }}>
              Configure a table for customer bookings.
            </p>

            {addError && <div className="admin-alert admin-alert--error">{addError}</div>}

            <form onSubmit={handleAddTable} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Table Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Table 04"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Guest Capacity *</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  className="admin-input"
                  value={addCapacity}
                  onChange={(e) => setAddCapacity(e.target.value)}
                  required
                />
                <span className="admin-input-hint">Maximum capacity is 6 guests per table.</span>
              </div>

              <div className="admin-field">
                <label className="admin-label">Initial Status</label>
                <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="add_status"
                      checked={addStatus === 'available'}
                      onChange={() => setAddStatus('available')}
                    />
                    <span>Available</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="add_status"
                      checked={addStatus === 'paused'}
                      onChange={() => setAddStatus('paused')}
                    />
                    <span>Paused</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal__actions" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="admin-btn admin-btn--secondary"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Adding...' : 'Add Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT TABLE ────────────────────────────────── */}
      {showEditModal && activeTable && (
        <div className="admin-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="admin-modal__title">Edit {activeTable.name}</h3>

            {editError && <div className="admin-alert admin-alert--error">{editError}</div>}

            <form onSubmit={handleSaveEdit} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Table Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Guest Capacity *</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  className="admin-input"
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(e.target.value)}
                  required
                />
                <span className="admin-input-hint">Maximum capacity is 6 guests per table.</span>
              </div>

              <div className="admin-field">
                <label className="admin-label">Physical Status</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="edit_status"
                      checked={editStatus === 'available'}
                      onChange={() => setEditStatus('available')}
                    />
                    <span><strong>Available</strong> (Ready for new reservations)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="edit_status"
                      checked={editStatus === 'occupied'}
                      onChange={() => setEditStatus('occupied')}
                    />
                    <span><strong>Occupied</strong> (Reserved or currently seated)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="edit_status"
                      checked={editStatus === 'paused'}
                      onChange={() => setEditStatus('paused')}
                    />
                    <span><strong>Paused</strong> (Temporarily not bookable)</span>
                  </label>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--admin-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowConfirmArchive(true)}
                  className="admin-btn admin-btn--danger admin-btn--sm"
                  disabled={actionLoading}
                >
                  Remove Table
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="admin-btn admin-btn--secondary"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn--primary"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CONFIRM REMOVE TABLE (ARCHIVE) ───────────── */}
      {showConfirmArchive && activeTable && (
        <div className="admin-modal-overlay" onClick={() => setShowConfirmArchive(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="admin-modal__title" style={{ color: 'var(--admin-error)' }}>
              REMOVE TABLE?
            </h3>
            <p className="admin-modal__body">
              This table will no longer be available for new reservations. Existing booking history will be preserved.
            </p>
            <div className="admin-modal__actions">
              <button
                type="button"
                onClick={() => setShowConfirmArchive(false)}
                className="admin-btn admin-btn--secondary"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleArchiveTable}
                className="admin-btn admin-btn--danger"
                disabled={actionLoading}
              >
                {actionLoading ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: BLOCK TIME ────────────────────────────────── */}
      {showBlockModal && (
        <div className="admin-modal-overlay" onClick={() => setShowBlockModal(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="admin-modal__title">Block Time for Table</h3>
            <p className="admin-modal__body" style={{ marginBottom: '16px' }}>
              Temporarily prevent reservations for a specific table during an event or maintenance.
            </p>

            {blockError && <div className="admin-alert admin-alert--error">{blockError}</div>}

            <form onSubmit={handleCreateBlock} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Select Table *</label>
                <select
                  className="admin-select"
                  value={blockResourceId}
                  onChange={(e) => setBlockResourceId(e.target.value)}
                  required
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.capacity} guests) — {t.status?.toUpperCase() || (t.active ? 'AVAILABLE' : 'PAUSED')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-field">
                <label className="admin-label">Date *</label>
                <input
                  type="date"
                  className="admin-input"
                  value={blockDate}
                  min={new Date().toLocaleDateString('en-CA')}
                  onChange={(e) => setBlockDate(e.target.value)}
                  required
                />
              </div>

              <div className="admin-field-row">
                <div className="admin-field">
                  <label className="admin-label">Start Time *</label>
                  <input
                    type="time"
                    className="admin-input"
                    value={blockStart}
                    onChange={(e) => setBlockStart(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">End Time *</label>
                  <input
                    type="time"
                    className="admin-input"
                    value={blockEnd}
                    onChange={(e) => setBlockEnd(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label">Reason (Internal note)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Private Birthday Event"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                />
              </div>

              <div className="admin-modal__actions" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="admin-btn admin-btn--secondary"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Saving...' : 'Block Period'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableReservations;
