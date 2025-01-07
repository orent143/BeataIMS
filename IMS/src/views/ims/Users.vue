<template>
    <div>
      <header class="inventory-header">
        <h1>Users</h1>
      </header>
      <UserList :users="users" @delete-user="deleteUser" />
    </div>
  </template>
  
  <script>
  import UserList from '@/components/UserList.vue';
  
  export default {
    components: { UserList },
    data() {
      return {
        users: [
          { id: 1, name: 'Alice', role: 'Admin' },
          { id: 2, name: 'Bob', role: 'Editor' },
          { id: 3, name: 'Charlie', role: 'Viewer' }
        ]
      };
    },
    methods: {
      deleteUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add styles here if needed */
  </style>
  