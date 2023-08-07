import { JSONContent } from "@tiptap/react";

export interface layoutItem {
    isDraggable: boolean;
    editMode: boolean;
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

export type classProfilePageTypes = {
    classPageId: string,
    content: string,
    layout: string,
    id: string
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