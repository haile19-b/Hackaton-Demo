export const getProjectData = async(functionData:object) => {
    const projectId = functionData.projectId;
    const models = functionData.models;
    try {
        const result = models.map((mod,indx)=>{
            // write here database schema, anlo by considering the conditional args for conflect and task
        })
    } catch (error) {
        
    }
}