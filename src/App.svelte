<script lang="ts">
  import { replace } from "svelte-spa-router";
  import Router from "svelte-spa-router";
  import { routes } from "./config/routes";

  const conditionsFailed = (event) => {
    console.log(
      "🚀 ~ file: App.svelte ~ line 17 ~ conditionsFailed ~ event",
      event
    );
    if (event.detail.location === "/login") replace("/");
  };
</script>

<main>
  <Router {routes} on:conditionsFailed={conditionsFailed} />
</main>
