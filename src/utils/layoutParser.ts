export interface layoutItem {
    w: number;
    h: number;
    x: number;
    y: number;
    i: string;
    minW: number;
    minH: number;
    moved: boolean;
    static: boolean;
}

export type dbLayoutType = {
    layouts: {
        lg: layoutItem[],
        md: layoutItem[],
        sm: layoutItem[],
    }
}

export const layoutParser: ({dbLayout, userRole}: {dbLayout : layoutItem, userRole: "ADMIN" | "STUDENT"})=>(layoutItem) = ({dbLayout, userRole}: {dbLayout : layoutItem, userRole: "ADMIN" | "STUDENT"}) => {
    if(userRole === "ADMIN"){
        let updatedLayout = {...dbLayout}
        updatedLayout = {...updatedLayout, static: false}
        return updatedLayout
    }
    else{
        let updatedLayout = {...dbLayout}
        updatedLayout = {...updatedLayout, static: true}
        return updatedLayout
    }


}