import bcrypt from 'bcryptjs'

export const plainToHash = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password, salt)
    console.log(hashpassword);
    return hashpassword
}

export const HashToPlain = async (password,hashpassword) => {
    const output = await bcrypt.compare(password,hashpassword);
    console.log(output)
    return output
}