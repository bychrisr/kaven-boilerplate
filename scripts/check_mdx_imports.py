import os
import re

DOCS_DIR = '/home/bychrisr/projects/kaven-boilerplate/apps/docs/content/design-system/components'
UI_DIR = '/home/bychrisr/projects/kaven-boilerplate/apps/docs/components/ui'

def main():
    if not os.path.exists(UI_DIR):
        print(f"Error: UI directory not found at {UI_DIR}")
        return

    # Get available components
    available_components = set()
    for f in os.listdir(UI_DIR):
        if f.endswith('.tsx'):
            available_components.add(f.replace('.tsx', ''))

    # Check each MDX file
    mdx_files = [f for f in os.listdir(DOCS_DIR) if f.endswith('.mdx')]
    
    missing_map = {}

    for filename in mdx_files:
        filepath = os.path.join(DOCS_DIR, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        # Regex to find imports from @/components/ui/*
        matches = re.finditer(r"from ['\"]@/components/ui/([^'\"]+)['\"]", content)
        
        for match in matches:
            component_slug = match.group(1)
            # Remove subpaths if any (though usually flat)
            component_base = component_slug.split('/')[0]
            
            if component_base not in available_components:
                if filename not in missing_map:
                    missing_map[filename] = set()
                missing_map[filename].add(component_base)

    # Report findings
    if missing_map:
        print("Missing components referenced in docs:")
        for filename, missing in missing_map.items():
            print(f"  {filename}: {', '.join(missing)}")
    else:
        print("All referenced components exist.")

if __name__ == '__main__':
    main()
