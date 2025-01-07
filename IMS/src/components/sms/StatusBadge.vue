<template>
    <span :class="['status-badge', status.toLowerCase()]">
      {{ status }}
    </span>
  </template>
  
  <script>
  export default {
    name: 'StatusBadge',
    props: {
      status: {
        type: String,
        required: true,
        validator: value => ['Pending', 'Preparing', 'Completed', 'Cancelled'].includes(value)
      }
    }
  }
  </script>
  
  <style scoped>
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: 500;
  }
  
  .status-badge.pending {
    background-color: #ff0000;
    color: #000;
  }
  
  .status-badge.preparing {
    background-color: #1e90ff;
    color: white;
  }
  
  .status-badge.completed {
    background-color: #32cd32;
    color: white;
  }
  
  .status-badge.cancelled {
    background-color: #ff4444;
    color: white;
  }
  </style>
  