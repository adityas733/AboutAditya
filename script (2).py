# Now let's add the CSS styles for the Education section to the existing CSS
# We need to add styles that match the existing experience section design

# Read the existing CSS
with open('style.css', 'r', encoding='utf-8') as file:
    css_content = file.read()

# Add education section styles after the experience section styles
education_css = '''
/* Education Section */
.education {
    padding: var(--space-32) 0;
    background: var(--color-bg-3);
}

.education-timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-24);
}

.education-item {
    display: flex;
    gap: var(--space-24);
    background: var(--color-surface);
    padding: var(--space-24);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-card-border);
    box-shadow: var(--shadow-sm);
    transition: transform var(--duration-normal) var(--ease-standard);
}

.education-item:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.education-logo {
    flex-shrink: 0;
}

.college-logo {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: var(--radius-base);
    background: var(--color-white);
    padding: var(--space-8);
    border: 1px solid var(--color-border);
    display: block;
}

.education-degree {
    font-size: var(--font-size-xl);
    margin: var(--space-8) 0;
    color: var(--color-primary);
}

.education-institution {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-12);
}

.education-description {
    color: var(--color-text-secondary);
    line-height: var(--line-height-normal);
}
'''

# Find the position to insert the education CSS (after experience section)
experience_section_end = css_content.find('/* Achievements Section */')
if experience_section_end == -1:
    # Fallback: insert before achievements section
    experience_section_end = css_content.find('.achievements {')

# Insert the education CSS
modified_css = css_content[:experience_section_end] + education_css + '\n\n' + css_content[experience_section_end:]

# Also need to update the responsive styles for education
responsive_education_css = '''
    .education-item {
        flex-direction: column;
        text-align: center;
    }
'''

# Find the responsive section and add education responsive styles
responsive_section = modified_css.find('.experience-item {\n        flex-direction: column;\n        text-align: center;\n    }')
if responsive_section != -1:
    # Insert after the experience responsive rules
    insert_pos = modified_css.find('}', responsive_section) + 1
    modified_css = modified_css[:insert_pos] + '\n\n    ' + responsive_education_css.strip() + modified_css[insert_pos:]

# Save the modified CSS file
with open('style_revised.css', 'w', encoding='utf-8') as file:
    file.write(modified_css)

print("Modified CSS file created successfully!")
print("\nCSS changes made:")
print("1. Added .education section styles matching experience section design")
print("2. Added .education-timeline, .education-item, .education-logo styles")
print("3. Added .college-logo, .education-degree, .education-institution styles")
print("4. Added responsive styles for mobile devices")
print("5. Used var(--color-bg-3) for education section background")