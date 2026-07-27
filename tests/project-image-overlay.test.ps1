$css = Get-Content -Raw -Encoding utf8 "$PSScriptRoot\..\css\style.css"

if ($css -match '(?s)\.project-image::before\s*\{.*?\}') {
    throw 'Project image overlay pseudo-element is still present.'
}
