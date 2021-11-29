export type AuthState =
  | {
      status: "checking";
    }
  | {
      status: "authenticated";
      token: string;
      id: number;
    }
  | {
      status: "not-authenticated";
    };

type AuthAction =
  | { type: "logIn"; payload: { token: string; id: number } }
  | { type: "logOut" };

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "logIn":
      return {
        ...state,
        status: "authenticated",
        token: action.payload.token,
        id: action.payload.id,
      };
    case "logOut":
      return {
        ...state,
        status: "not-authenticated",
      };
    default:
      return state;
  }
};
