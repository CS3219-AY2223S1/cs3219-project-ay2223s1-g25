import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from '../constants.js';
import { ormCreateUser as _createUser } from '../model/user-orm.js'

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.status == STATUS_CODE_CONFLICT) {
                return res.status(STATUS_CODE_CONFLICT).json({message: 'User already exist!'});
            } else if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!'});
            }  else {
                console.log(`Created new user ${username} successfully!`)
                //create jwt token here
                return res.status(STATUS_CODE_CREATED).json({message: `Created new user ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}
