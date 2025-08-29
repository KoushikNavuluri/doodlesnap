export interface DoodleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  prompt: string;
  parameters: TemplateParameter[];
  colorPalettes: string[];
  previewImage?: string;
}

export interface TemplateParameter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  required: boolean;
}

export interface FilledTemplate {
  template: DoodleTemplate;
  parameters: Record<string, string>;
  colorPalette: string;
}
