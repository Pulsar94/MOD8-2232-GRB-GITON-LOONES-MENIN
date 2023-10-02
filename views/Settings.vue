<template>
  <div>
    <h1>Settings</h1>
    <form @submit.prevent="saveChanges">
      <div class="informations" v-if="!editing">
        <p>Name: {{ initialName }}</p>
        <p>Age: {{ initialAge }}</p>
        <p>Email: {{ initialEmail }}</p>
        <p>Phone: {{ initialPhone }}</p>
        <p>
          Password: {{ passwordShown }}
          <button type="button" id="password" @click="togglePasswordVisibility">
            Show/Hide
          </button>
        </p>
        <button @click="editing = true">Edit</button>
      </div>
      <div class="informations" v-else>
        <p>Name: <input type="text" v-model="editedName" /></p>
        <p>Age: <input type="number" v-model="editedAge" /></p>
        <p>Email: <input type="email" v-model="editedEmail" /></p>
        <p>Phone: <input type="number" v-model="editedPhone" /></p>
        <p>Password: <input type="password" v-model="editedPassword" /></p>
        <div class="buttons">
          <button type="submit">Save</button>
          <button type="button" @click="cancelEditing">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";

export default {
  setup() {
    const store = useStore();

    const initialName = ref(store.state.user.name);
    const initialAge = ref(store.state.user.age);
    const initialEmail = ref(store.state.user.email);
    const initialPhone = ref(store.state.user.phone);
    const initialPassword = ref(store.state.user.password);

    const editedName = ref(store.state.user.name);
    const editedAge = ref(store.state.user.age);
    const editedEmail = ref(store.state.user.email);
    const editedPhone = ref(store.state.user.phone);
    const editedPassword = ref(store.state.user.password);

    const editing = ref(false);
    const passwordShown = ref("•".repeat(editedPassword.value.length));

    const saveChanges = () => {
      if (
        !editedName.value ||
        !editedAge.value ||
        !editedEmail.value ||
        !editedPhone.value ||
        !editedPassword.value
      ) {
        alert("Please fill in all fields");
        return;
      }

      if (editedAge.value < 5 || editedAge.value > 150) {
        alert("Incorrect age");
        return;
      }

      if (
        editedPhone.value.toString().length < 8 ||
        editedPhone.value.toString().length > 16
      ) {
        alert("Phone number must be between 8 and 16 digits");
        return;
      }

      initialName.value = editedName.value;
      initialAge.value = editedAge.value;
      initialEmail.value = editedEmail.value;
      initialPhone.value = editedPhone.value;
      initialPassword.value = editedPassword.value;

      const updatedUser = {
        name: editedName.value,
        age: editedAge.value,
        email: editedEmail.value,
        phone: editedPhone.value,
        password: editedPassword.value,
      };

      store.commit("UPDATE_USER", updatedUser);

      editing.value = false;
    };

    const cancelEditing = () => {
      editedName.value = initialName.value;
      editedAge.value = initialAge.value;
      editedEmail.value = initialEmail.value;
      editedPhone.value = initialPhone.value;
      editedPassword.value = initialPassword.value;

      editing.value = false;
    };

    return {
      initialName,
      initialAge,
      initialEmail,
      initialPhone,
      initialPassword,
      editedName,
      editedAge,
      editedEmail,
      editedPhone,
      editedPassword,
      editing,
      passwordShown,
      saveChanges,
      cancelEditing,
    };
  },
  data: () => ({
    editedName: "",
    editedAge: "",
    editedEmail: "",
    editedPhone: "",
    editedPassword: "",
  }),
  methods: {
    togglePasswordVisibility() {
      this.passwordShown =
        this.passwordShown === this.initialPassword
          ? "•".repeat(this.initialPassword.length)
          : this.initialPassword;
    },
  },
};
</script>

<style scoped>
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.informations {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.informations p {
  margin: 5px 0;
  font-size: large;
}

.informations input {
  width: 200px;
}

button {
  margin: 20px;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#password {
  margin: 0 12px;
}
</style>
