import { MDXEditor, MDXEditorMethods } from "@mdxeditor/editor";
import { useEffect, useRef } from "react";

import "@mdxeditor/editor/style.css";

export const CommentEditor = ({
  onChange,
  commentText
}: {
  commentText?: string;
  onChange: (markdown: string) => void;
}) => {
  const ref = useRef<MDXEditorMethods>(null);

  const handleChange = () => {
    if (ref.current) {
      onChange(ref.current.getMarkdown());
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.setMarkdown(commentText || '');
    }
  }, [commentText]);

  return (
    <div className="space-y-4">
      <div className="overflow-y-auto max-h-32 border rounded-md">
        <MDXEditor
          ref={ref}
          markdown={""}
          contentEditableClassName="prose"
          placeholder="Write a comment..."
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
