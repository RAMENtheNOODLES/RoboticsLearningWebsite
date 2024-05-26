import AceEditor from "react-ace"

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

export function EditorBox() {
    return <AceEditor/>
}