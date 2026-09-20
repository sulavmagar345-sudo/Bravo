import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { fetchAllEnquiries, updateEnquiryStatus } from '../services/enquiries';
import type { Enquiry, EnquiryStatus } from '../types';

const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function loadEnquiries() {
    try {
      setLoading(true);
      const data = await fetchAllEnquiries();
      setEnquiries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: EnquiryStatus) {
    try {
      await updateEnquiryStatus(id, status);
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status } : e));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  }

  if (selectedEnquiry) {
    return (
      <div>
        <PageHeader 
          title="Enquiry Details" 
          action={
            <button className="admin-btn admin-btn--ghost" onClick={() => setSelectedEnquiry(null)}>
              ← Back to List
            </button>
          }
        />
        <div className="admin-card admin-enquiry-detail">
          <div className="admin-card__body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <StatusBadge variant={selectedEnquiry.status} />
              <span className="admin-text-muted" style={{ fontSize: '0.85rem' }}>
                {new Date(selectedEnquiry.created_at).toLocaleString()}
              </span>
            </div>

            <div className="admin-enquiry-detail__field">
              <span className="admin-enquiry-detail__label">Full Name</span>
              <span className="admin-enquiry-detail__value">{selectedEnquiry.full_name}</span>
            </div>
            <div className="admin-enquiry-detail__field">
              <span className="admin-enquiry-detail__label">Program of Interest</span>
              <span className="admin-enquiry-detail__value">{selectedEnquiry.program}</span>
            </div>
            <div className="admin-enquiry-detail__field">
              <span className="admin-enquiry-detail__label">Contact Details</span>
              <span className="admin-enquiry-detail__value">
                {selectedEnquiry.email} <br/>
                {selectedEnquiry.phone}
              </span>
            </div>
            <div className="admin-enquiry-detail__field">
              <span className="admin-enquiry-detail__label">Message</span>
              <span className="admin-enquiry-detail__value">{selectedEnquiry.message}</span>
            </div>

            <div className="admin-enquiry-detail__actions">
              <select 
                className="admin-select" 
                style={{ width: 'auto' }}
                value={selectedEnquiry.status}
                onChange={e => handleStatusChange(selectedEnquiry.id, e.target.value as EnquiryStatus)}
              >
                <option value="new">Mark as New</option>
                <option value="contacted">Mark as Contacted</option>
                <option value="follow-up">Needs Follow-up</option>
                <option value="closed">Mark as Closed</option>
              </select>
              
              <a 
                href={`mailto:${selectedEnquiry.email}`} 
                className="admin-btn admin-btn--secondary"
              >
                Email User
              </a>
              <a 
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`} 
                target="_blank" rel="noopener noreferrer"
                className="admin-btn admin-btn--secondary"
              >
                WhatsApp User
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Enquiries" 
        subtitle="Manage student applications and contact forms."
      />

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Program</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : enquiries.length === 0 ? (
                <tr><td colSpan={5} className="admin-empty">No enquiries found.</td></tr>
              ) : (
                enquiries.map(enq => (
                  <tr key={enq.id} style={{ opacity: enq.status === 'closed' ? 0.6 : 1 }}>
                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: 600 }}>{enq.full_name}</td>
                    <td>{enq.program}</td>
                    <td><StatusBadge variant={enq.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={() => setSelectedEnquiry(enq)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Enquiries;
