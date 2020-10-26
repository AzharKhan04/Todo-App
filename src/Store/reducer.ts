const initialState:any  = {
    tasks:[]
}

export const appReducer = (state:any = initialState,ACTION:any) => {
    switch (ACTION.type) {
        case "ADDTASKS" : return {...state,tasks:ACTION.payload}
        default: return state
    }
}