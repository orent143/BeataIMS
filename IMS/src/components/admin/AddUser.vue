<template>
  <div class="popout-form" v-if="isVisible">
    <div class="form-header">
      <h2>Add User</h2>
      <button class="close-btn" @click="closeForm">x</button>
    </div>
    <form @submit.prevent="submit" class="form-container">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input id="name" v-model="formData.name" type="text" placeholder="Enter full name" required />
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input id="email" v-model="formData.email" type="email" placeholder="Enter email" required />
      </div>

      <div class="form-group">
        <label for="role">Role</label>
        <select id="role" v-model="formData.role" required>
          <option value="" disabled>Select Role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="formData.status" required>
          <option value="" disabled>Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="formData.password" type="password" placeholder="Enter password" required />
      </div>

      <div class="form-actions">
        <button type="submit" class="add-btn">Add User</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        role: '',
        status: 'active',
        password: ''
      }
    };
  },
  methods: {
    closeForm() {
      this.resetForm();
      this.$emit('close');
    },
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        role: '',
        status: 'active',
        password: ''
      };
    },
    submit() {
      const newUser = {
        ...this.formData,
        lastLogin: null
      };
      this.$emit('add', newUser);
      this.closeForm();
    }
  }
};
</script>

<style scoped>
.popout-form {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.459);
  position: absolute;
  right: 50%;
  top: 50%;
  transform: translate(50%, -50%);
  width: 500px; /* Increase width for 2 columns */
  max-width: 100%;
  z-index: 1000;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-header h2 {
  font-size: 25px;
  font-family: 'Arial', sans-serif;
  font-weight: 1000;
  color: #000000;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 17px;
  color: #333;
  cursor: pointer;
  font-weight: 1000;
}

.form-container {
  display: grid;
  gap: 15px;
  grid-template-columns: 1fr 1fr; /* Define two equal columns */
  grid-template-rows: auto;
}

.form-group {
  width: 100%;
}

label {
  font-weight: 600;
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
  color: #272727;
}

input,
select {
  padding: 10px;
  font-size: 14px;
  border-radius: 12px;
  width: 100%;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.add-btn {
  padding: 10px 20px;
  background-color: #01a501f8;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #00b32d;
}

.add-btn:focus {
  outline: none;
}
</style>
