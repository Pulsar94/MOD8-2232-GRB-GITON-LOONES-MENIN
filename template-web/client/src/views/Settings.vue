<template>
  <body>
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
            {{ passwordShown === initialPassword ? "Hide" : "Show" }}
          </button>
        </p>
        <p>Limit: {{ limit }}</p>
        <div class="buttons">
          <button type="button" @click="logOut">Log Out</button>
          <button @click="editing = true">Edit</button>
        </div>
      </div>
      <div class="informations" v-else>
        <p>Name: <input type="text" v-model="editedName" /></p>
        <p>Age: <input type="number" v-model="editedAge" /></p>
        <p>Email: <input type="email" v-model="editedEmail" /></p>
        <p>Phone: <input type="number" v-model="editedPhone" /></p>
        <p>Password: <input type="password" v-model="editedPassword" /></p>
        <p>Limit: <input type="number" v-model="limit" /></p>
        <div class="notification-container">
          <p>Notification preferences:</p>
          <select name="notifications">
            <option ref="email" value="email" :selected="initialNotifications === 'email'">Email</option>
            <option ref="sms" value="sms" :selected="initialNotifications === 'sms'">SMS</option>
            <option ref="both" value="both" :selected="initialNotifications === 'both'">Both</option>
            <option ref="none" value="none" :selected="initialNotifications === 'none'">None</option>
          </select>
        </div>
        <div class="buttons">
          <button type="submit">Save</button>
          <button type="button" @click="cancelEditing">Cancel</button>
        </div>
      </div>
    </form>
  </body>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const users = ref(store.state.user);

    const user = users.value.find((user) => {
      return user.email === store.state.userIDActive;
    });

    const initialName = ref(user.name);
    const initialAge = ref(user.age);
    const initialEmail = ref(user.email);
    const initialPhone = ref(user.phone);
    const initialPassword = ref(user.password);
    const initialNotifications = ref(user.notifications);

    const editedName = ref(user.name);
    const editedAge = ref(user.age);
    const editedEmail = ref(user.email);
    const editedPhone = ref(user.phone);
    const editedPassword = ref(user.password);
    const editedNotifications = ref(user.notifications);

    const editing = ref(false);
    // console.log(editedPassword)
    const passwordShown = ref("•".repeat(editedPassword.value.length));

    const limit = ref(store.state.limit);

    const saveChanges = () => {
      // console.log(limit);
      if (!editedName.value || !editedAge.value || !editedEmail.value || !editedPhone.value || !editedPassword.value) {
        alert("Please fill in  allfields");
        return;
      }

      if (editedAge.value < 5 || editedAge.value > 150) {
        alert("Incorrect age");
        return;
      }

      if (editedPhone.value.toString().length < 8 || editedPhone.value.toString().length > 16) {
        alert("Phone number must be between 8 and 16 digits");
        return;
      }

      editedNotifications.value = document.querySelector("select[name=notifications]").value;

      initialName.value = editedName.value;
      initialAge.value = editedAge.value;
      initialEmail.value = editedEmail.value;
      initialPhone.value = editedPhone.value;
      initialPassword.value = editedPassword.value;
      initialNotifications.value = editedNotifications.value;

      const updatedUser = {
        name: editedName.value,
        age: editedAge.value,
        email: editedEmail.value,
        phone: editedPhone.value,
        password: editedPassword.value,
        notifications: editedNotifications.value,
      };

      // console.log(updatedUser);

      store.commit("SET_LIMIT", limit.value);
      store.commit("UPDATE_USER", updatedUser);

      editing.value = false;

      passwordShown.value = "•".repeat(editedPassword.value.length);
    };

    const cancelEditing = () => {
      editedName.value = initialName.value;
      editedAge.value = initialAge.value;
      editedEmail.value = initialEmail.value;
      editedPhone.value = initialPhone.value;
      editedPassword.value = initialPassword.value;

      editing.value = false;
    };

    const logOut = () => {
      store.commit("LOG_OUT");
      alert("You have been logged out");
      router.push("/");
    };

    return {
      initialName,
      initialAge,
      initialEmail,
      initialPhone,
      initialPassword,
      initialNotifications,
      editedName,
      editedAge,
      editedEmail,
      editedPhone,
      editedPassword,
      editedNotifications,
      editing,
      passwordShown,
      saveChanges,
      cancelEditing,
      logOut,
      limit,
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
      this.passwordShown = this.passwordShown === this.initialPassword ? "•".repeat(this.initialPassword.length) : this.initialPassword;
    },
  },
};
</script>

<style scoped>
@import url("../../assets/css/variables.css");
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  color: var(--header-text);
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
  margin: 20px 15px 40px 15px;
  padding: 5px 10px;
  background-color: var(--form-button);
  color: var(--black);
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: var(--form-button-hover);
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#password {
  margin: 0 12px;
  background-color: var(--table-row);
  color: var(--black);
  font-size: 10px;
}

#password:hover {
  background-color: var(--table-row-odd);
}

input {
  padding: 5px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background-color: var(--text-input);
  color: var(--text);
}

select {
  width: 200px;
  padding: 5px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background-color: var(--text-input);
  color: var(--text);
}

select:hover {
  background-color: var(--select-hover);
}

.notification-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

@media (max-width: 400px) {
  .notification-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
