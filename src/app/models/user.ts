export class User2 {
    constructor(
        name?: string, 
        email?: string, 
        password?: string, 
        role_id?: number,
        role_name?: string,
        token?: string
        ) {}
  }
  
  export class User {
    auth_token?: string;
    user_data?: UserData
}

class UserData {
    name: string;
    email: string;
    password: string;
    role_id: string;
    role_name: string;
}