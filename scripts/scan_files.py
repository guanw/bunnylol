import os

def print_files_in_dir(
    root_dir,
    exclude_dirs=None,
    exclude_postfixes=None,
):
    if exclude_dirs is None:
        exclude_dirs = []
    if exclude_postfixes is None:
        exclude_postfixes = []

    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Remove excluded directories in-place so os.walk won't go into them
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]

        for filename in filenames:
            # Skip by postfix
            if any(filename.endswith(postfix) for postfix in exclude_postfixes):
                continue

            file_path = os.path.join(dirpath, filename)

            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
            except Exception as e:
                print(f"Skipping {file_path}: {e}")
                continue

            print(f"File: {file_path}")
            print(content)
            print("---------\n")


if __name__ == "__main__":
    # Example usage
    directory = input("Enter directory path: ").strip()
    print_files_in_dir(
        directory,
        exclude_dirs=["node_modules", ".git", "__pycache__", ".husky", "scripts"],
        exclude_postfixes=[".log", ".pyc", ".DS_Store", ".gitignore", "package-lock.json"],
    )
