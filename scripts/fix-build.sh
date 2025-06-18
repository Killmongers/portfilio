#!/bin/bash

echo "🔧 Fixing Build Issues"
echo "====================="

# Create missing directories
echo "📁 Creating missing directories..."
mkdir -p lib
mkdir -p app
mkdir -p components/ui

# Check if required files exist
echo "🔍 Checking required files..."

required_files=(
    "lib/utils.ts"
    "lib/avatar-utils.ts"
    "tsconfig.json"
    "tailwind.config.ts"
    "postcss.config.mjs"
    "app/globals.css"
    "next-env.d.ts"
    "package.json"
    "next.config.mjs"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required files are present!"
else
    echo "❌ Missing files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo ""
    echo "💡 Please ensure all files are committed to your repository."
fi

# Check package.json dependencies
echo ""
echo "📦 Checking package.json dependencies..."
if [ -f "package.json" ]; then
    if grep -q "clsx" package.json && grep -q "tailwind-merge" package.json; then
        echo "✅ Required dependencies found in package.json"
    else
        echo "❌ Missing required dependencies in package.json"
        echo "💡 Make sure clsx and tailwind-merge are in dependencies"
    fi
else
    echo "❌ package.json not found"
fi

# Test TypeScript compilation
echo ""
echo "🔍 Testing TypeScript compilation..."
if command -v npx &> /dev/null; then
    if npx tsc --noEmit --skipLibCheck; then
        echo "✅ TypeScript compilation successful"
    else
        echo "❌ TypeScript compilation failed"
        echo "💡 Check the TypeScript errors above"
    fi
else
    echo "⚠️  npx not available, skipping TypeScript check"
fi

echo ""
echo "🚀 Build fix complete!"
echo ""
echo "📋 Next steps:"
echo "1. Commit all missing files to your repository"
echo "2. Push changes to GitHub"
echo "3. Trigger a new deployment on Render"

