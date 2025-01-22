import axios from "axios";
import kc_params from "./keycloakConfig";

// Axios Instance for communication with keycloak server
const keycloakAxiosInstance = axios.create({
  baseURL: kc_params.URL + "/auth/admin/realms/" + kc_params.Realm,
  headers: {
    "Content-Type": "application/json",
  },
});

export default keycloakAxiosInstance;