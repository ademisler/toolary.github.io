#!/bin/bash

for file in *.html; do
  if [ "$file" != "header_template.html" ] && [ "$file" != "color-picker.html" ]; then
    echo "Fixing: $file"
    
    # Create clean version with proper front matter
    head -n 1 "$file" > "${file}.clean"
    sed -n '2,/^---$/p' "$file" >> "${file}.clean"
    
    # Add header
    cat >> "${file}.clean" << 'HEADER'

<!-- Simple Header -->
<header class="simple-header" style="background: var(--toolary-bg); border-bottom: 1px solid var(--toolary-border); padding: 15px 0;">
  <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between;">
    <a href="{{ site.baseurl }}/" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--toolary-text);">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--toolary-accent);">
        <rect x="3" y="3" width="7" height="7" fill="currentColor"/>
        <rect x="14" y="3" width="7" height="7" fill="currentColor"/>
        <rect x="14" y="14" width="7" height="7" fill="currentColor"/>
        <rect x="3" y="14" width="7" height="7" fill="currentColor"/>
      </svg>
      <span style="font-size: 1.2rem; font-weight: 600;">Toolary</span>
    </a>
    
    <div style="display: flex; align-items: center; gap: 20px;">
      <a href="{{ site.baseurl }}/#tools" style="color: var(--toolary-text-secondary); text-decoration: none; font-size: 0.95rem;">All Tools</a>
      <a href="https://chromewebstore.google.com/detail/efecahgaobadfmaecclkfnfdfmincbmm" style="background: var(--toolary-accent); color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 0.9rem; font-weight: 500;">Download Extension</a>
    </div>
  </div>
</header>
HEADER
    
    # Add content after header (skip duplicate front matter)
    sed -n '/^<!-- Breadcrumb Navigation -->/,$p' "$file" >> "${file}.clean"
    
    # Replace original
    mv "${file}.clean" "$file"
  fi
done

echo "All files fixed properly!"
