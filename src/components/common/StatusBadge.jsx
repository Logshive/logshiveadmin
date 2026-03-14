import React from 'react';

const StatusBadge = ({ status }) => {
  const getColor = () => {
    switch(status?.toLowerCase()) {
      case 'facebook':
        return 'bg-blue-50 text-blue-600';
      case 'instagram':
        return 'bg-pink-50 text-pink-600';
      case 'tiktok':
        return 'bg-gray-50 text-gray-600';
      case 'twitter/x':
        return 'bg-sky-50 text-sky-600';
      case 'active':
        return 'bg-green-50 text-green-600';
      case 'pending':
        return 'bg-yellow-50 text-yellow-600';
      case 'completed':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded ${getColor()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;