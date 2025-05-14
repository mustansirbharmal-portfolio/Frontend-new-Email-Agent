import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Image, 
  Link, 
  CornerDownLeft 
} from "lucide-react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

export function Editor({ value, onChange, placeholder = "Write your message here...", minRows = 8 }: EditorProps) {
  const [currentValue, setCurrentValue] = useState(value);
  
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentValue(e.target.value);
    onChange(e.target.value);
  };
  
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("email-body") as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentValue.substring(start, end);
    const beforeText = currentValue.substring(0, start);
    const afterText = currentValue.substring(end);
    
    const newValue = beforeText + prefix + selectedText + suffix + afterText;
    setCurrentValue(newValue);
    onChange(newValue);
    
    // Set focus back to textarea with correct cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selectedText.length;
    }, 0);
  };
  
  const formatBold = () => insertMarkdown("**", "**");
  const formatItalic = () => insertMarkdown("*", "*");
  const formatBulletList = () => insertMarkdown("\n- ");
  const formatNumberedList = () => insertMarkdown("\n1. ");
  const formatLink = () => insertMarkdown("[", "](url)");
  const formatImage = () => insertMarkdown("![alt text](", ")");
  
  return (
    <div className="border border-gray-300 rounded-md mt-1">
      {/* Text Editor Toolbar */}
      <div className="flex flex-wrap items-center bg-gray-50 p-2 border-b border-gray-300 rounded-t-md">
        <Button type="button" variant="ghost" size="sm" onClick={formatBold} className="p-1 rounded text-gray-500 hover:text-gray-700 mr-1">
          <Bold className="h-5 w-5" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatItalic} className="p-1 rounded text-gray-500 hover:text-gray-700 mr-1">
          <Italic className="h-5 w-5" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatBulletList} className="p-1 rounded text-gray-500 hover:text-gray-700 mr-1">
          <List className="h-5 w-5" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatNumberedList} className="p-1 rounded text-gray-500 hover:text-gray-700 mr-1">
          <ListOrdered className="h-5 w-5" />
        </Button>
        <div className="w-px h-5 bg-gray-300 mx-2"></div>
        <Button type="button" variant="ghost" size="sm" className="p-1 rounded text-gray-500 hover:text-gray-700 mr-1">
          <AlignLeft className="h-5 w-5" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="p-1 rounded text-gray-500 hover:text-gray-700 mr-1">
          <AlignCenter className="h-5 w-5" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="p-1 rounded text-gray-500 hover:text-gray-700 mr-1">
          <AlignRight className="h-5 w-5" />
        </Button>
        <div className="w-px h-5 bg-gray-300 mx-2"></div>
        <Button type="button" variant="ghost" size="sm" onClick={formatImage} className="p-1 rounded text-gray-500 hover:text-gray-700 mr-1">
          <Image className="h-5 w-5" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatLink} className="p-1 rounded text-gray-500 hover:text-gray-700 mr-1">
          <Link className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Text Area */}
      <Textarea
        id="email-body"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        rows={minRows}
        className="block w-full shadow-sm focus:ring-primary focus:border-primary sm:text-sm border-0 rounded-b-md resize-none"
      />
    </div>
  );
}
