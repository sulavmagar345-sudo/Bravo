import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { fetchAllResources, updateResource } from '../services/resources';
import { fetchBookingSettingsMap, updateAllBookingSettings } from '../services/booking-settings';
import type { Resource, BookingSettingsMap } from '../types';

const BookingSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resources, setResources] = useState<Resource[]>([]);
  const [settings, setSettings] = useState<Partial<BookingSettingsMap>>({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [resData, setMap] = await Promise.all([
        fetchAllResources(),
        fetchBookingSettingsMap()
      ]);
      setResources(resData);
      setSettings(setMap);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSettingChange = (key: keyof BookingSettingsMap, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await updateAllBookingSettings(settings);
      alert('Settings saved successfully');
    } catch (err: any) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleResourceActive = async (id: string, current: boolean) => {
    try {
      await updateResource(id, { active: !current });
      setResources(prev => prev.map(r => r.id === id ? { ...r, active: !current } : r));
    } catch (err) {
      alert('Failed to update resource');
    }
  };

  if (loading) return <div className="admin-loading">Loading settings...</div>;

  return (
    <div className="admin-booking-settings">
      <PageHeader 
        title="Booking Settings & Resources" 
        subtitle="Manage availability, pricing, and active resources."
      />

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* SETTINGS CARD */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">General Settings</h3>
          </div>
          <div className="admin-card__body">
            
            <h4 style={{ margin: '1rem 0 0.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>Features</h4>
            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Enable Table Bookings</label>
              <select 
                className="admin-select"
                value={settings.table_booking_enabled || 'true'}
                onChange={(e) => handleSettingChange('table_booking_enabled', e.target.value)}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled (Hidden)</option>
              </select>
            </div>
            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Enable Netflix Room</label>
              <select 
                className="admin-select"
                value={settings.netflix_booking_enabled || 'true'}
                onChange={(e) => handleSettingChange('netflix_booking_enabled', e.target.value)}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled (Hidden)</option>
              </select>
            </div>

            <h4 style={{ margin: '1.5rem 0 0.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>Pricing & Duration</h4>
            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Netflix Room Price / Hour (Rs)</label>
              <input 
                type="number" 
                className="admin-input" 
                value={settings.netflix_price_per_hour || ''}
                onChange={(e) => handleSettingChange('netflix_price_per_hour', e.target.value)}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Table Default Duration (Minutes)</label>
              <input 
                type="number" 
                className="admin-input" 
                value={settings.table_default_duration_minutes || ''}
                onChange={(e) => handleSettingChange('table_default_duration_minutes', e.target.value)}
              />
            </div>

            <h4 style={{ margin: '1.5rem 0 0.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>Availability Window</h4>
            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Opening Time</label>
              <input 
                type="time" 
                className="admin-input" 
                value={settings.opening_time || ''}
                onChange={(e) => handleSettingChange('opening_time', e.target.value)}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Closing Time</label>
              <input 
                type="time" 
                className="admin-input" 
                value={settings.closing_time || ''}
                onChange={(e) => handleSettingChange('closing_time', e.target.value)}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Min. Advance Booking (Minutes)</label>
              <input 
                type="number" 
                className="admin-input" 
                value={settings.min_advance_minutes || ''}
                onChange={(e) => handleSettingChange('min_advance_minutes', e.target.value)}
              />
            </div>

            <button 
              className="admin-btn admin-btn--primary" 
              onClick={saveSettings}
              disabled={saving}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* RESOURCES CARD */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Resources</h3>
          </div>
          <div className="admin-card__body">
            <p style={{ fontSize: '0.9rem', color: '#687771', marginBottom: '1rem' }}>
              Toggle resources on or off. Disabled resources won't be available for booking.
            </p>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Cap.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(res => (
                  <tr key={res.id}>
                    <td><strong>{res.name}</strong></td>
                    <td>{res.type === 'netflix_room' ? 'Netflix' : 'Table'}</td>
                    <td>{res.capacity}</td>
                    <td>
                      <button 
                        onClick={() => toggleResourceActive(res.id, res.active)}
                        className={`admin-badge ${res.active ? 'admin-badge--success' : 'admin-badge--danger'}`}
                        style={{ cursor: 'pointer', border: 'none', width: '100%' }}
                      >
                        {res.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingSettings;
