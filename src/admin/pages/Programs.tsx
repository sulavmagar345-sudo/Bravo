import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { fetchAllProgramStatuses, updateProgramStatus } from '../services/programs';
import { ENROLLMENT_STATUS_LABELS } from '../types';
import type { ProgramStatus, EnrollmentStatus } from '../types';

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingStatusFor, setSavingStatusFor] = useState<string | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    try {
      setLoading(true);
      const data = await fetchAllProgramStatuses();
      setPrograms(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(slug: string, newStatus: EnrollmentStatus) {
    try {
      setSavingStatusFor(slug);
      setError(null);
      await updateProgramStatus(slug, newStatus);
      setPrograms(programs.map(p => p.slug === slug ? { ...p, enrollment_status: newStatus } : p));
    } catch (err: any) {
      setError(err.message || 'Failed to update program status');
    } finally {
      setSavingStatusFor(null);
    }
  }

  return (
    <div>
      <PageHeader 
        title="Programs" 
        subtitle="Manage the enrollment status for your training programs."
      />

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {loading ? (
        <div className="admin-loading"><span className="admin-spinner" /> Loading programs...</div>
      ) : (
        <div className="admin-program-list">
          {programs.map(prog => (
            <div key={prog.id} className="admin-program-row">
              <div className="admin-program-row__name">
                {prog.display_name}
                <div style={{ marginTop: 6 }}>
                  <StatusBadge variant={prog.enrollment_status} label={ENROLLMENT_STATUS_LABELS[prog.enrollment_status]} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="admin-label" style={{ marginRight: 10 }}>Set Status:</span>
                <select 
                  className="admin-select"
                  style={{ width: 180 }}
                  value={prog.enrollment_status}
                  onChange={e => handleStatusChange(prog.slug, e.target.value as EnrollmentStatus)}
                  disabled={savingStatusFor === prog.slug}
                >
                  <option value="open">Open for Enrollment</option>
                  <option value="coming-soon">Coming Soon</option>
                  <option value="closed">Closed</option>
                  <option value="hidden">Hidden</option>
                </select>
                {savingStatusFor === prog.slug && <span className="admin-spinner" style={{ width: 16, height: 16 }} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Programs;
