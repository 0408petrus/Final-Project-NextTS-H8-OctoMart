export type FormResponse = {
  errors: {
    email?: string[] | undefined;
    password?: string[] | undefined;
  };
};