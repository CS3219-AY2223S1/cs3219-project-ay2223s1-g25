import React, {useCallback, useEffect, useState} from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { getCollabSocket } from '../socket';

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: 'ordered'}, { list: 'bullet'}],
    ["bold", "italic", "underline"],
    [{ color: []}, { background: []}],
    [{ script: 'sub'}, { script: 'super'}],
    [{ align: []}],
    ["image", "blockquote", "code-block"],
    ["clean"],
] 

export default function TextEditor() {
    const [quill, setQuill] = useState()

    useEffect(() => {
        if(getCollabSocket() == null || quill == null) return
    
        const handler = (delta) => {
            quill.updateContents(delta)
        }

        getCollabSocket().on('receive-changes', handler)

        return () => {
            getCollabSocket().off('receive-changes', handler)
        }
    }, [quill])

    useEffect(() => {
        if(getCollabSocket() == null || quill == null) return
    
        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return

            getCollabSocket().emit("send-changes", delta)
        }

        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }
    }, [quill])

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) {
            return
        }

        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, {theme: "snow", modules: { toolbar : TOOLBAR_OPTIONS}})
        setQuill(q)
    }, [])
  return <div className="text-container" ref={wrapperRef}></div>
}
