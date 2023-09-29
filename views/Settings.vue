<template>
  <div>
    <h1>Settings</h1>
    <form @submit.prevent="saveChanges">
      <div class="informations" v-if="!editing">
        <p>Name: {{ initialName }}</p>
        <p>Age: {{ initialAge }}</p>
        <p>Email: {{ initialEmail }}</p>
        <p>Phone: {{ initialPhone }}</p>
        <p>Password: {{ passwordShown }}</p>
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
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useStore } from "vuex";
import { ref } from "vue";

export default {
  setup() {
    const v$ = useVuelidate();
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
    const passwordShown = ref("·".repeat(editedPassword.value.length));

    const validations = {
      editedName: { required },
      editedAge: { required },
      editedEmail: { required, email },
      editedPhone: { required },
      editedPassword: { required },
    };

    const saveChanges = () => {
      if (v$.$invalid) {
        // Handle validation errors
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
      v$,
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
      validations,
      saveChanges,
      cancelEditing,
    };
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
</style>
