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
import {
  fetchBookingSettingsMap,
  updateBookingSetting,
} from '../services/booking-settings';
import type { Resource, ResourceStatus, BlockedTime } from '../types';

export const NetflixRoomAdmin: React.FC = () => {
  const [rooms, setRooms] = useState<Resource[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [pricePerHour, setPricePerHour] = useState<number>(300);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showConfirmArchive, setShowConfirmArchive] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Resource | null>(null);

  // Add Room Form
  const [addName, setAddName] = useState('');
  const [addCapacity, setAddCapacity] = useState('6');
  const [addStatus, setAddStatus] = useState<ResourceStatus>('available');
  const [addError, setAddError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit Room Form
  const [editName, setEditName] = useState('');
  const [editCapacity, setEditCapacity] = useState('6');
  const [editStatus, setEditStatus] = useState<ResourceStatus>('available');
  const [editError, setEditError] = useState<string | null>(null);

  // Price Edit Form
  const [newPrice, setNewPrice] = useState('300');
  const [priceError, setPriceError] = useState<string | null>(null);

  // Block Time Form
  const [blockResourceId, setBlockResourceId] = useState('');
  const [blockDate, setBlockDate] = useState('');
  const [blockStart, setBlockStart] = useState('16:00');
  const [blockEnd, setBlockEnd] = useState('19:00');
  const [blockReason, setBlockReason] = useState('Private Screening');
  const [blockError, setBlockError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [roomList, blocks, settingsMap] = await Promise.all([
        fetchResourcesByType('netflix_room'),
        fetchBlockedTimesByType('netflix_room'),
        fetchBookingSettingsMap(),
      ]);
      setRooms(roomList);
      setBlockedTimes(blocks);

      const parsedPrice = parseInt(settingsMap.netflix_price_per_hour || '300', 10);
      setPricePerHour(isNaN(parsedPrice) ? 300 : parsedPrice);
      setNewPrice(isNaN(parsedPrice) ? '300' : parsedPrice.toString());
      setError(null);
    } catch (err: any) {
      setError('Failed to load Netflix room data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function showMessage(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  }

  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;
  const pausedCount = rooms.filter((r) => r.status === 'paused').length;

  // Mark Available
  async function handleMarkAvailable(room: Resource) {
    try {
      await markResourceAvailable(room.id);
      setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, status: 'available', active: true } : r)));
      showMessage(`${room.name} is now AVAILABLE for new reservations.`);
    } catch (err: any) {
      alert('Failed to mark room available: ' + err.message);
    }
  }

  // Mark Occupied
  async function handleMarkOccupied(room: Resource) {
    try {
      await markResourceOccupied(room.id);
      setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, status: 'occupied', active: true } : r)));
      showMessage(`${room.name} is now OCCUPIED.`);
    } catch (err: any) {
      alert('Failed to mark room occupied: ' + err.message);
    }
  }

  // Toggle Pause
  async function handleTogglePause(room: Resource) {
    const isPaused = room.status === 'paused';
    const nextStatus: ResourceStatus = isPaused ? 'available' : 'paused';
    try {
      await setResourceStatus(room.id, nextStatus);
      setRooms((prev) =>
        prev.map((r) => (r.id === room.id ? { ...r, status: nextStatus, active: nextStatus === 'available' } : r))
      );
      showMessage(`${room.name} is now ${nextStatus === 'available' ? 'AVAILABLE' : 'PAUSED'}.`);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  }

  // Open Edit
  function handleOpenEdit(room: Resource) {
    setActiveRoom(room);
    setEditName(room.name);
    setEditCapacity(room.capacity.toString());
    setEditStatus(room.status || (room.active ? 'available' : 'paused'));
    setEditError(null);
    setShowEditModal(true);
  }

  // Save Edit
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeRoom) return;

    const trimmedName = editName.trim();
    const cap = parseInt(editCapacity, 10);

    if (!trimmedName) {
      setEditError('Room name is required.');
      return;
    }
    if (isNaN(cap) || cap < 1) {
      setEditError('Please enter a valid guest capacity.');
      return;
    }

    const isDuplicate = rooms.some(
      (r) =>
        r.id !== activeRoom.id &&
        r.name.toLowerCase().trim() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setEditError('A room with this name already exists.');
      return;
    }

    setActionLoading(true);
    setEditError(null);

    try {
      await updateResource(activeRoom.id, {
        name: trimmedName,
        capacity: cap,
        status: editStatus,
        active: editStatus === 'available' || editStatus === 'occupied',
      });
      setRooms((prev) =>
        prev.map((r) =>
          r.id === activeRoom.id
            ? { ...r, name: trimmedName, capacity: cap, status: editStatus, active: editStatus === 'available' || editStatus === 'occupied' }
            : r
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

  // Add Room
  async function handleAddRoom(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = addName.trim();
    const cap = parseInt(addCapacity, 10);

    if (!trimmedName) {
      setAddError('Room name is required.');
      return;
    }
    if (isNaN(cap) || cap < 1) {
      setAddError('Please enter a valid guest capacity.');
      return;
    }

    const isDuplicate = rooms.some(
      (r) => r.name.toLowerCase().trim() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setAddError('A room with this name already exists.');
      return;
    }

    setActionLoading(true);
    setAddError(null);

    try {
      const created = await createResource({
        type: 'netflix_room',
        name: trimmedName,
        capacity: cap,
        status: addStatus,
        active: addStatus === 'available',
      });
      setRooms((prev) => [...prev, created]);
      setShowAddModal(false);
      setAddName('');
      setAddCapacity('6');
      setAddStatus('available');
      showMessage(`Added ${trimmedName} successfully.`);
    } catch (err: any) {
      setAddError(err.message || 'Failed to add room.');
    } finally {
      setActionLoading(false);
    }
  }

  // Remove Room (Archive)
  async function handleArchiveRoom() {
    if (!activeRoom) return;
    setActionLoading(true);
    try {
      await archiveResource(activeRoom.id);
      setRooms((prev) => prev.filter((r) => r.id !== activeRoom.id));
      setShowConfirmArchive(false);
      setShowEditModal(false);
      showMessage(`${activeRoom.name} removed from future availability. Existing booking history is preserved.`);
      setActiveRoom(null);
    } catch (err: any) {
      alert('Failed to remove room: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // Save Price
  async function handleSavePrice(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseInt(newPrice, 10);
    if (isNaN(parsed) || parsed < 0) {
      setPriceError('Please enter a valid hourly rate.');
      return;
    }

    setActionLoading(true);
    setPriceError(null);

    try {
      await updateBookingSetting('netflix_price_per_hour', parsed.toString());
      setPricePerHour(parsed);
      setShowPriceModal(false);
      showMessage(`Updated hourly price to Rs. ${parsed.toLocaleString()}.`);
    } catch (err: any) {
      setPriceError(err.message || 'Failed to update price.');
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
      setBlockReason('Private Screening');
      showMessage('Blocked time created. This interval is unavailable for online bookings.');
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
        title="Netflix Room"
        subtitle="Control Netflix room physical availability and pricing. You decide when the room is released."
        action={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setBlockResourceId(rooms[0]?.id || '');
                setBlockDate(new Date().toLocaleDateString('en-CA'));
                setBlockError(null);
                setShowBlockModal(true);
              }}
              className="admin-btn admin-btn--secondary"
              disabled={rooms.length === 0}
            >
              Block Time
            </button>
            <button
              onClick={() => {
                setAddName('');
                setAddCapacity('6');
                setAddStatus('available');
                setAddError(null);
                setShowAddModal(true);
              }}
              className="admin-btn admin-btn--primary"
            >
              + Add Room
            </button>
          </div>
        }
      />

      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {successMsg && <div className="admin-alert admin-alert--success">{successMsg}</div>}

      {/* Summary Cards */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
        <div className={`admin-stat-card ${availableCount > 0 ? 'admin-stat-card--highlight' : ''}`}>
          <div className="admin-stat-card__label">Available Rooms</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : `${availableCount} / ${rooms.length}`}
          </div>
        </div>
        <div className={`admin-stat-card ${occupiedCount > 0 ? 'admin-stat-card--highlight' : ''}`}>
          <div className="admin-stat-card__label">Occupied Rooms</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : `${occupiedCount} / ${rooms.length}`}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Paused Rooms</div>
          <div className="admin-stat-card__value">{loading ? '-' : pausedCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Rate Per Hour</div>
          <div
            className="admin-stat-card__value"
            style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '1.5rem' }}
          >
            <span>Rs. {loading ? '-' : pricePerHour.toLocaleString()}</span>
            <button
              onClick={() => {
                setNewPrice(pricePerHour.toString());
                setPriceError(null);
                setShowPriceModal(true);
              }}
              className="admin-btn admin-btn--ghost admin-btn--sm"
              style={{ fontSize: '0.75rem', padding: '2px 6px' }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Rooms List Card */}
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <div className="admin-card__header">
          <div>
            <h3 className="admin-card__title">Configured Netflix Rooms</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              When a guest is using the room, mark it <strong>Occupied</strong>. When they leave, click <strong>Mark Available</strong>.
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            {rooms.length} room{rooms.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="admin-card__body" style={{ padding: 0 }}>
          {loading ? (
            <div className="admin-empty">Loading Netflix rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="admin-empty">
              <p>No Netflix rooms configured yet.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="admin-btn admin-btn--secondary admin-btn--sm"
                style={{ marginTop: '12px' }}
              >
                + Add Netflix Room
              </button>
            </div>
          ) : (
            <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Room Name</th>
                    <th>Capacity</th>
                    <th>Hourly Price</th>
                    <th>Physical Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => {
                    const status = room.status || (room.active ? 'available' : 'paused');
                    return (
                      <tr key={room.id}>
                        <td>
                          <strong style={{ fontSize: '0.95rem' }}>{room.name}</strong>
                        </td>
                        <td>
                          <span style={{ color: 'var(--admin-text-muted)' }}>
                            {room.capacity} guests
                          </span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--admin-text-muted)' }}>
                            Rs. {pricePerHour.toLocaleString()} / hr
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
                                onClick={() => handleMarkAvailable(room)}
                                className="admin-btn admin-btn--primary admin-btn--sm"
                                title="Guest finished screening. Release room for bookings."
                              >
                                Mark Available
                              </button>
                            )}

                            {status === 'available' && (
                              <button
                                onClick={() => handleMarkOccupied(room)}
                                className="admin-btn admin-btn--secondary admin-btn--sm"
                                title="Mark room as currently in use."
                              >
                                Mark Occupied
                              </button>
                            )}

                            {status === 'paused' ? (
                              <button
                                onClick={() => handleTogglePause(room)}
                                className="admin-btn admin-btn--primary admin-btn--sm"
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleTogglePause(room)}
                                className="admin-btn admin-btn--secondary admin-btn--sm"
                              >
                                Pause
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenEdit(room)}
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
              Periods when a Netflix room is temporarily closed for maintenance or private VIP screenings.
            </p>
          </div>
          <button
            onClick={() => {
              setBlockResourceId(rooms[0]?.id || '');
              setBlockDate(new Date().toLocaleDateString('en-CA'));
              setBlockError(null);
              setShowBlockModal(true);
            }}
            className="admin-btn admin-btn--secondary admin-btn--sm"
            disabled={rooms.length === 0}
          >
            + Block Period
          </button>
        </div>

        <div className="admin-card__body" style={{ padding: 0 }}>
          {blockedTimes.length === 0 ? (
            <div className="admin-empty" style={{ padding: '32px 16px' }}>
              <p>No blocked times currently scheduled for Netflix rooms.</p>
            </div>
          ) : (
            <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Room</th>
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
                      rooms.find((r) => r.id === block.resource_id)?.name ||
                      'Netflix Room';

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

      {/* ── MODAL: ADD ROOM ──────────────────────────────────── */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="admin-modal__title">Add Netflix Room</h3>
            <p className="admin-modal__body" style={{ marginBottom: '16px' }}>
              Add a Netflix room to your inventory.
            </p>

            {addError && <div className="admin-alert admin-alert--error">{addError}</div>}

            <form onSubmit={handleAddRoom} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Room Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Netflix Room 02"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Capacity (Guests) *</label>
                <input
                  type="number"
                  min="1"
                  className="admin-input"
                  value={addCapacity}
                  onChange={(e) => setAddCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Hourly Rate</label>
                <input
                  type="text"
                  className="admin-input"
                  value={`Rs. ${pricePerHour.toLocaleString()} / hour (Standard)`}
                  disabled
                />
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
                  {actionLoading ? 'Adding...' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT ROOM ─────────────────────────────────── */}
      {showEditModal && activeRoom && (
        <div className="admin-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="admin-modal__title">Edit {activeRoom.name}</h3>

            {editError && <div className="admin-alert admin-alert--error">{editError}</div>}

            <form onSubmit={handleSaveEdit} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Room Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Capacity (Guests) *</label>
                <input
                  type="number"
                  min="1"
                  className="admin-input"
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Hourly Rate</label>
                <input
                  type="text"
                  className="admin-input"
                  value={`Rs. ${pricePerHour.toLocaleString()} / hour`}
                  disabled
                />
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
                    <span><strong>Occupied</strong> (Reserved or in session)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="edit_status"
                      checked={editStatus === 'paused'}
                      onChange={() => setEditStatus('paused')}
                    />
                    <span><strong>Paused</strong> (Temporarily closed)</span>
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
                  Remove Room
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

      {/* ── MODAL: CONFIRM REMOVE ROOM (ARCHIVE) ─────────────── */}
      {showConfirmArchive && activeRoom && (
        <div className="admin-modal-overlay" onClick={() => setShowConfirmArchive(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="admin-modal__title" style={{ color: 'var(--admin-error)' }}>
              REMOVE ROOM?
            </h3>
            <p className="admin-modal__body">
              This room will no longer be available for new reservations. Existing booking history will remain intact.
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
                onClick={handleArchiveRoom}
                className="admin-btn admin-btn--danger"
                disabled={actionLoading}
              >
                {actionLoading ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT PRICE ────────────────────────────────── */}
      {showPriceModal && (
        <div className="admin-modal-overlay" onClick={() => setShowPriceModal(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '380px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="admin-modal__title">Update Netflix Rate</h3>
            <p className="admin-modal__body" style={{ marginBottom: '16px' }}>
              Standard hourly price charged for Netflix room bookings. Future bookings will use this rate; historical bookings will keep their original amount.
            </p>

            {priceError && <div className="admin-alert admin-alert--error">{priceError}</div>}

            <form onSubmit={handleSavePrice} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Price per Hour (Rs.) *</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  className="admin-input"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="admin-modal__actions" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowPriceModal(false)}
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
                  {actionLoading ? 'Saving...' : 'Save Price'}
                </button>
              </div>
            </form>
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
            <h3 className="admin-modal__title">Block Time for Netflix Room</h3>
            <p className="admin-modal__body" style={{ marginBottom: '16px' }}>
              Temporarily prevent reservations for a Netflix room during maintenance or private use.
            </p>

            {blockError && <div className="admin-alert admin-alert--error">{blockError}</div>}

            <form onSubmit={handleCreateBlock} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Select Room *</label>
                <select
                  className="admin-select"
                  value={blockResourceId}
                  onChange={(e) => setBlockResourceId(e.target.value)}
                  required
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.capacity} guests) — {r.status?.toUpperCase() || (r.active ? 'AVAILABLE' : 'PAUSED')}
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
                  placeholder="e.g. System Maintenance"
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

export default NetflixRoomAdmin;
