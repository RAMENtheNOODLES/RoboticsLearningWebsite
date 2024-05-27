'use client'
import Editor from '@monaco-editor/react'

export function EditorBox() {
    return (
        <div>
            <Editor height="100vh" defaultLanguage='java' defaultValue="// some comment"/>
        </div>
        
    )
}