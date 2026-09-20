import React from 'react';
import type { BannerComputedState, EnquiryStatus, EnrollmentStatus } from '../types';

type BadgeVariant = BannerComputedState | EnquiryStatus | EnrollmentStatus | 'published' | 'hidden' | 'draft';

interface Props {
  variant: BadgeVariant;
  label?: string;
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  scheduled: 'Scheduled',
  draft: 'Draft',
  expired: 'Expired',
  hidden: 'Hidden',
  published: 'Published',
  new: 'New',
  contacted: 'Contacted',
  'follow-up': 'Follow-up',
  closed: 'Closed',
  open: 'Open',
  'coming-soon': 'Coming Soon',
};

const StatusBadge: React.FC<Props> = ({ variant, label }) => (
  <span className={`admin-badge admin-badge--${variant}`}>
    {label ?? STATUS_LABELS[variant] ?? variant}
  </span>
);

export default StatusBadge;
