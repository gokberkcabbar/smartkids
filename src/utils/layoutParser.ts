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
        lg?: layoutItem[],
        md?: layoutItem[],
        sm?: layoutItem[]
    }
}

export const layoutParser: ({dbLayout, userRole}: {dbLayout : dbLayoutType, userRole: "ADMIN" | "STUDENT"})=>(dbLayoutType) = ({dbLayout, userRole}: {dbLayout : dbLayoutType, userRole: "ADMIN" | "STUDENT"}) => {
    if(userRole === "ADMIN"){
        const updatedLayout = {...dbLayout}
        updatedLayout.layouts.lg?.forEach((val)=>val.static = false)
        updatedLayout.layouts.md?.forEach((val)=>val.static = false)
        updatedLayout.layouts.sm?.forEach((val)=>val.static = false)
        return updatedLayout
    }
    else{
        return dbLayout
    }


}