import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import FileUpload from '../components/FileUpload';
import { fetchAllVideos, replaceVideo, updateVideoStatus, getVideoUrl } from '../services/videos';
import type { Video } from '../types';

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      setLoading(true);
      const data = await fetchAllVideos();
      setVideos(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(video: Video) {
    try {
      await updateVideoStatus(video.id, !video.active);
      setVideos(videos.map(v => v.id === video.id ? { ...v, active: !video.active } : v));
    } catch (err: any) {
      setError(err.message || 'Failed to update video status');
    }
  }

  async function handleReplaceVideo(video: Video, file: File) {
    try {
      setUploadingSlot(video.slot_name);
      setError(null);
      
      const updated = await replaceVideo(video.id, file, video.video_path, video.slot_name);
      setVideos(videos.map(v => v.id === video.id ? updated : v));
    } catch (err: any) {
      setError(err.message || `Failed to replace video for ${video.display_name}`);
    } finally {
      setUploadingSlot(null);
    }
  }

  return (
    <div>
      <PageHeader 
        title="Video Management" 
        subtitle="Manage the primary video slots shown on the website."
      />

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {loading ? (
        <div className="admin-loading"><span className="admin-spinner" /> Loading videos...</div>
      ) : (
        <div className="admin-video-list">
          {videos.map(video => (
            <div key={video.id} className="admin-card admin-video-card">
              <div className="admin-video-card__preview">
                <video 
                  src={getVideoUrl(video.video_path)} 
                  controls 
                  preload="metadata"
                  style={{ opacity: video.active ? 1 : 0.5 }}
                />
              </div>
              
              <div className="admin-video-card__info">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 className="admin-video-card__title">{video.display_name}</h3>
                  <span className={`admin-badge ${video.active ? 'admin-badge--published' : 'admin-badge--hidden'}`}>
                    {video.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                
                <p className="admin-video-card__desc">{video.description}</p>
                
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 16 }}>
                  <button 
                    className={`admin-btn ${video.active ? 'admin-btn--secondary' : 'admin-btn--primary'}`}
                    onClick={() => handleToggleStatus(video)}
                    disabled={uploadingSlot === video.slot_name}
                  >
                    {video.active ? 'Hide Video' : 'Show Video'}
                  </button>
                  
                  {uploadingSlot === video.slot_name ? (
                    <span className="admin-text-muted" style={{ fontSize: '0.85rem' }}>Uploading...</span>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      {/* Hide standard input, trigger via button */}
                      <input 
                        type="file" 
                        id={`upload-${video.id}`}
                        accept="video/mp4,video/webm,video/quicktime"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleReplaceVideo(video, e.target.files[0]);
                          e.target.value = ''; // reset
                        }}
                      />
                      <label htmlFor={`upload-${video.id}`} className="admin-btn admin-btn--secondary" style={{ cursor: 'pointer' }}>
                        Replace Video
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;
