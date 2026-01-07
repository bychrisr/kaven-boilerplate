import os

UI_DIR = '/home/bychrisr/projects/kaven-boilerplate/apps/docs/components/ui'

HOOKS_AND_CONTEXT = [
    'createContext', 'useState', 'useEffect', 'useReducer', 'useCallback', 
    'useMemo', 'useRef', 'useLayoutEffect', 'useContext', 'useId',
    'onClick', 'onChange', 'onKeyDown' # Event handlers often imply interactivity
]

def main():
    if not os.path.exists(UI_DIR):
        print(f"Error: UI directory not found at {UI_DIR}")
        return

    count = 0
    for filename in os.listdir(UI_DIR):
        if not filename.endswith('.tsx'):
            continue
            
        filepath = os.path.join(UI_DIR, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        # Check if already has 'use client'
        if 'use client' in content[:100]:
            print(f"Skipping {filename} (already has 'use client')")
            continue

        # Check for indicators of interactivity
        is_interactive = any(indicator in content for indicator in HOOKS_AND_CONTEXT)
        
        if is_interactive:
            print(f"Adding 'use client' to {filename}")
            new_content = "'use client';\n\n" + content
            with open(filepath, 'w') as f:
                f.write(new_content)
            count += 1

    print(f"Updated {count} files.")

if __name__ == '__main__':
    main()
