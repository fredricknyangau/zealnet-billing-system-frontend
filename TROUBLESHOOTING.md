# Troubleshooting Guide

## Common Issues and Solutions

### Vite Error Overlay

If you see a Vite error overlay, follow these steps:

1. **Check the browser console** for the actual error message
2. **Check the terminal** where `npm run dev` is running for build errors
3. **Install dependencies** if you haven't already:
   ```bash
   npm install
   ```

### Common Errors

#### 1. "Cannot find module" or Import Errors

**Solution**: Make sure all dependencies are installed:
```bash
npm install
```

#### 2. TypeScript Errors

**Solution**: Run type checking:
```bash
npm run type-check
```

#### 3. Theme Store Initialization Error

If you see errors related to theme initialization:
- Clear browser localStorage
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for specific error messages

#### 4. i18n Initialization Error

If translation errors occur:
- Check that `src/lib/i18n.ts` is properly imported in `main.tsx`
- Verify i18next dependencies are installed

#### 5. Route Errors

If routing doesn't work:
- Check that `react-router-dom` is installed
- Verify routes are properly defined in `App.tsx`

### Development Server Issues

#### Port Already in Use

If port 3000 is already in use:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change the port in vite.config.ts
```

#### Build Errors

Clear cache and rebuild:
```bash
rm -rf node_modules/.vite
npm run build
```

### Browser Compatibility

- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Enable JavaScript
- Check browser console for errors

### Environment Variables

Make sure `.env` file exists (or copy from `.env.example`):
```env
VITE_API_URL=https://api.example.com
```

### Still Having Issues?

1. Check the browser console (F12) for detailed error messages
2. Check the terminal output from `npm run dev`
3. Verify all files are saved correctly
4. Try clearing browser cache and localStorage
5. Restart the development server

