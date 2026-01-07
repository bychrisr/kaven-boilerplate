import os
import re

DOCS_DIR = '/home/bychrisr/projects/kaven-boilerplate/apps/docs/content/design-system/components'
UI_DIR = '/home/bychrisr/projects/kaven-boilerplate/apps/docs/components/ui'

def get_exports_from_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    exports = set()
    # Match: export const Name or export function Name or export class Name
    matches = re.findall(r'export (?:const|function|class|interface|type) (\w+)', content)
    exports.update(matches)
    
    # Match: export { Name } or export { Name as Alias }
    matches_named = re.findall(r'export \{([^}]+)\}', content)
    for match in matches_named:
        items = match.split(',')
        for item in items:
            parts = item.strip().split(' as ')
            exports.add(parts[-1].strip()) # Add the alias or the name

    return exports

def main():
    if not os.path.exists(UI_DIR):
        print(f"Error: UI directory not found at {UI_DIR}")
        return

    # Cache exports for each component
    component_exports = {}
    for f in os.listdir(UI_DIR):
        if f.endswith('.tsx') or f.endswith('.ts'):
            component_name = f.replace('.tsx', '').replace('.ts', '')
            component_exports[component_name] = get_exports_from_file(os.path.join(UI_DIR, f))

    # Check MDX files
    mdx_files = [f for f in os.listdir(DOCS_DIR) if f.endswith('.mdx')]
    
    mismatches = []

    for filename in mdx_files:
        filepath = os.path.join(DOCS_DIR, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        # Regex to find imports from @/components/ui/*
        # Matches: import { Foo, Bar as Baz } from '@/components/ui/file'
        import_matches = re.finditer(r"import \{([^}]+)\} from ['\"]@/components/ui/([^'\"]+)['\"]", content)
        
        for match in import_matches:
            imported_names_str = match.group(1)
            component_slug = match.group(2).split('/')[0] # handle subpaths if any

            if component_slug not in component_exports:
                # We already checked file existence in previous script, but good to report
                # mismatches.append(f"{filename}: Component '{component_slug}' not found")
                continue

            available_exports = component_exports[component_slug]
            
            # Parse imported names
            # Handle multiline imports and comments (basic)
            imports = [i.strip() for i in imported_names_str.split(',')]
            for imp in imports:
                if not imp: continue
                # Handle "Foo as Bar"
                parts = imp.split(' as ')
                original_name = parts[0].strip()
                
                if original_name and original_name not in available_exports:
                    mismatches.append(f"{filename}: Export '{original_name}' not found in '{component_slug}' (Available: {', '.join(list(available_exports)[:5])}...)")

    if mismatches:
        print("Export mismatches found:")
        for m in mismatches:
            print(f"  {m}")
    else:
        print("All imports valid.")

if __name__ == '__main__':
    main()
