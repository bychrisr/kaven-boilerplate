import os
import re

DOCS_DIR = '/home/bychrisr/projects/kaven-boilerplate/apps/docs/content/design-system/components'
COMPONENTS_UI_DIR = '/home/bychrisr/projects/kaven-boilerplate/apps/admin/components/ui'

def to_pascal_case(s):
    return ''.join(word.title() for word in s.split('-'))

def process_file(filename):
    if not filename.endswith('.mdx'):
        return

    filepath = os.path.join(DOCS_DIR, filename)
    with open(filepath, 'r') as f:
        content = f.read()

    # Skip if already migrated
    if '<ComponentPreview>' in content:
        print(f"Skipping {filename} (already has ComponentPreview)")
        return

    basename = filename.replace('.mdx', '')
    component_name = to_pascal_case(basename)
    
    # Special cases handling if needed
    if basename == 'dialog': component_name = 'Dialog' # ... usually works
    
    print(f"Processing {filename} -> {component_name}...")

    # 1. Add Imports
    # Find end of frontmatter
    frontmatter_end = content.find('---', 3)
    if frontmatter_end == -1:
        print(f"Error: No frontmatter in {filename}")
        return

    # Prepare imports
    imports = f"\n\nimport {{ {component_name} }} from '@/components/ui/{basename}';"
    imports += f"\nimport {{ ComponentPreview }} from '@/components/ComponentPreview';"
    
    # Insert imports
    new_content = content[:frontmatter_end+3] + imports + content[frontmatter_end+3:]

    # 2. Wrap Examples
    # Pattern: find ```tsx ... ``` blocks
    # We want to maintain the block, but add a preview before it.
    
    def replacer(match):
        code_block = match.group(0)
        code_content = match.group(1).strip()
        
        # Simple heuristic: if it looks like JSX (starts with <)
        if not code_content.strip().startswith('<'):
            return code_block
            
        # If it contains imports (e.g. import { Button } ...), don't preview the whole block blindly
        if 'import ' in code_content:
            return code_block

        # Check for multiple lines/elements to wrap in div
        lines = [l for l in code_content.split('\n') if l.strip()]
        
        preview_content = code_content
        if len(lines) > 1:
            preview_content = f'<div className="flex w-full gap-4 flex-wrap justify-center items-center">\n{code_content}\n</div>'
        
        return f'\n<ComponentPreview>\n{preview_content}\n</ComponentPreview>\n\n{code_block}'

    # Regex for ```tsx code blocks
    pattern = r'```tsx\n(.*?)\n```'
    new_content = re.sub(pattern, replacer, new_content, flags=re.DOTALL)

    with open(filepath, 'w') as f:
        f.write(new_content)

def main():
    files = os.listdir(DOCS_DIR)
    for f in files:
        process_file(f)

if __name__ == '__main__':
    main()
