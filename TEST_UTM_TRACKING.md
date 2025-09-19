# Test UTM Tracking Implementation

## 🚀 Server Running
- **Local**: http://localhost:3001
- **Network**: http://192.168.100.30:3001

## 🔗 Test URLs with UTMs

### Test 1: Instagram VSL Campaign (Mexico)
```
http://localhost:3001/es/vsl?utm_source=instagram&utm_medium=rrss&utm_campaign=vsl_spanish_mx&utm_content=story_link
```

### Test 2: Instagram Bio Link (Colombia)
```
http://localhost:3001/es?utm_source=instagram&utm_medium=rrss&utm_campaign=landing_bio_link&utm_content=col
```

### Test 3: LinkedIn Organic
```
http://localhost:3001/es?utm_source=social-media&utm_medium=linkedin&utm_campaign=organic&utm_content=post_share
```

### Test 4: Google Ads with GCLID
```
http://localhost:3001/es?utm_source=google&utm_medium=cpc&utm_campaign=search_brand&gclid=ABC123XYZ
```

### Test 5: Facebook Ads with FBCLID
```
http://localhost:3001/es?utm_source=facebook&utm_medium=paid&utm_campaign=lookalike_audience&fbclid=FB789ABC&utm_content=video_ad
```

## 📱 What to Test

1. **Open any test URL above**
2. **Click "Agenda un demo" button**
3. **Check browser console** for debug logs:
   - Should see: `📊 Booking Modal - UTM Parameters: ...`
   - Should see: `🔗 Meeting URL with UTMs: ...`
4. **Verify iframe URL** includes the original UTM parameters

## 🔍 Expected Results

### Console Output Example:
```
📊 Booking Modal - UTM Parameters: utm_source=instagram, utm_medium=rrss, utm_campaign=vsl_spanish_mx, utm_content=story_link
🔗 Meeting URL with UTMs: https://meetings.hubspot.com/sebastian-jimenez-trujillo/lahausai-demo?embed=true&lang=es&utm_source=instagram&utm_medium=rrss&utm_campaign=vsl_spanish_mx&utm_content=story_link
```

### HubSpot Meeting URL Should Include:
- ✅ Original UTM parameters
- ✅ Language parameter
- ✅ Embed parameter

## 🎯 VSL Page Testing

Test VSL specific modal:
```
http://localhost:3001/es/vsl?utm_source=instagram&utm_medium=rrss&utm_campaign=vsl_spanish_col
```

Expected VSL meeting URL:
```
https://meetings.hubspot.com/sebastian-jimenez-trujillo/vsl-demo?embed=true&utm_source=instagram&utm_medium=rrss&utm_campaign=vsl_spanish_col
```

## ✅ Success Criteria

- [ ] Console logs show captured UTMs
- [ ] Meeting iframe URL includes UTM parameters
- [ ] No JavaScript errors in console
- [ ] Modal opens correctly with proper URL
- [ ] Works for both main page and VSL page
- [ ] Supports different locales (es/en)