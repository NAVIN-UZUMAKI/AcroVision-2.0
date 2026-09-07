import { CheckCircle2, AlertTriangle, AlertCircle, AlertOctagon, HelpCircle } from 'lucide-react';

function getBadgeConfig(status, customLabel) {
  const normalized = (status || '').toUpperCase().trim();

  if (normalized === 'GOOD' || normalized === 'OPTIMAL' || normalized === 'HEALTHY') {
    return {
      badgeClass: 'badge-good',
      Icon: CheckCircle2,
      label: customLabel || 'Good',
    };
  }
  if (normalized === 'WATCH' || normalized === 'ATTENTION') {
    return {
      badgeClass: 'badge-watch',
      Icon: AlertTriangle,
      label: customLabel || 'Watch',
    };
  }
  if (normalized === 'ACTION NEEDED' || normalized === 'ACTION' || normalized === 'WARNING') {
    return {
      badgeClass: 'badge-action',
      Icon: AlertCircle,
      label: customLabel || 'Action Needed',
    };
  }
  if (normalized === 'URGENT' || normalized === 'CRITICAL' || normalized === 'EMERGENCY') {
    return {
      badgeClass: 'badge-urgent',
      Icon: AlertOctagon,
      label: customLabel || 'Urgent',
    };
  }
  return {
    badgeClass: 'badge-neutral',
    Icon: HelpCircle,
    label: customLabel || status || 'Normal',
  };
}

export default function StatusBadge({ status, size = 'md', showIcon = true, customLabel }) {
  const { badgeClass, Icon, label } = getBadgeConfig(status, customLabel);
  const sizeStyle = size === 'sm' ? { fontSize: '0.7rem', padding: '2px 8px' } : {};

  return (
    <span className={`badge ${badgeClass}`} style={sizeStyle} role="status" aria-label={`Status: ${label}`}>
      {showIcon && <Icon size={size === 'sm' ? 12 : 14} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
}
