<script lang="ts">
  import { push } from "svelte-spa-router";
  import logoChatbot from "./../assets/chatbot.png";
  import { authStore } from "./../state/store";
  import { login } from "./../api/auth";
  import Header from "./../components/Header.svelte";
  import { notify } from "./../utils/notification";
  import type { IUserLogin } from "./../interfaces/auth.interface";

  let user: IUserLogin = {
    emailOrCode: "",
    password: "",
  };

  let disabledForm = true;
  let loading = false;

  $: user.emailOrCode && user.password
    ? (disabledForm = false)
    : (disabledForm = true);

  const onSubmitHandler = async () => {
    try {
      loading = true;
      let response = await login(user);
      response.accessToken = "";

      authStore.setUserSession(response);
      await push("/");
      loading = false;
      notify("success", "Bienvenido", "Inicio de sesión exitoso");
    } catch (error) {
      console.log("error", error);
      loading = false;
    }
  };
</script>

<Header />
<div class="container form-signin w-100">
  <form on:submit|preventDefault={onSubmitHandler}>
    <img
      class="mb-3 center"
      src={logoChatbot}
      alt=""
      width="100"
      height="100"
    />
    <h1 class="h3 mb-3 fw-normal text-center">Iniciar sesión</h1>

    <div class="form-floating mb-3">
      <input
        type="text"
        class="form-control"
        id="floatingInput"
        placeholder="name@example.com"
        bind:value={user.emailOrCode}
      />
      <label for="floatingInput">Código o dirección de correo electrónico</label
      >
    </div>
    <div class="form-floating mb-3">
      <input
        type="password"
        class="form-control"
        id="floatingPassword"
        placeholder="Password"
        bind:value={user.password}
      />
      <label for="floatingPassword">Contraseña</label>
    </div>

    <button
      class="w-100 btn btn-lg btn-primary mb-3"
      type="submit"
      disabled={disabledForm}
    >
      {#if loading}
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
      {/if}
      Iniciar sesión
    </button>
    <p class="text-center">
      <a href="/">¿Olvidaste tu contraseña?</a>
    </p>
  </form>
</div>

<style>
  .form-signin {
    max-width: 330px;
    padding: 15px;
    margin-top: 70px;
  }

  .form-signin .form-floating:focus-within {
    z-index: 2;
  }

  .form-signin input[type="text"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  label {
    font-size: 14px;
  }

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>
