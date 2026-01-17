import bcrybt from "bcrypt"

export const hashedpswd = async(plentypswd:string)=>{
    const salt = 10
    const hashedPassword = await bcrybt.hash(plentypswd,salt)
    return hashedPassword
}