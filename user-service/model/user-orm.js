import { createUser, isUser } from './repository.js';
import {STATUS_CODE_CONFLICT} from "../constants.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        if (await isUser({username})) {
            return { err : "User exist.", status : STATUS_CODE_CONFLICT };
        }
        const newUser = await createUser({username, password});
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}
