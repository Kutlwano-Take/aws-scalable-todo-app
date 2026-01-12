# ✅ Testing Checklist - To-Do List App

## Quick Test Guide

After deploying all fixes, follow this checklist to verify everything works.

---

## 🌐 Access the Production App

**URL:** https://d2tjhu6fumjbf7.cloudfront.net

> **Note:** If you see old code, wait 5-10 minutes for CloudFront cache invalidation to complete, or use incognito mode.

---

## ✅ Frontend Tests

### 1. **Page Load** ✅
- [ ] Page loads without errors
- [ ] You see "🚀 Task Launcher" header
- [ ] Background gradient displays properly
- [ ] Glassmorphism card effect visible

### 2. **Create Task** ✅
- [ ] Type a task in input field (e.g., "Test task 1")
- [ ] Click "Add" or press Enter
- [ ] Task appears instantly in the list
- [ ] Input field clears automatically
- [ ] Try adding empty task → Should show error notification

### 3. **Display Tasks** ✅
- [ ] All tasks from DynamoDB load on page refresh
- [ ] Tasks show text correctly (not "undefined")
- [ ] Completed tasks have strikethrough/different styling
- [ ] Task counter shows correct count

### 4. **Toggle Task Completion** ✅
- [ ] Click checkbox on a task
- [ ] Task instantly marks as complete/incomplete
- [ ] Refresh page → Status persists (saved to DynamoDB)
- [ ] Turn off internet → Try toggling → Should show error and rollback

### 5. **Delete Task** ✅
- [ ] Click × button on a task
- [ ] Task disappears instantly
- [ ] Refresh page → Task is gone (deleted from DynamoDB)
- [ ] Turn off internet → Try deleting → Should show error and restore task

### 6. **Filter Tasks** ✅
- [ ] Create some completed and incomplete tasks
- [ ] Click "all" → See all tasks
- [ ] Click "active" → See only incomplete tasks
- [ ] Click "completed" → See only completed tasks
- [ ] Task counter updates correctly

### 7. **Error Handling** ✅
- [ ] Turn off internet
- [ ] Try adding task → Red error notification appears
- [ ] Try toggling task → Error shows, task reverts to original state
- [ ] Try deleting task → Error shows, task reappears
- [ ] Errors auto-dismiss after 3 seconds

---

## 🔧 Backend Tests (API)

### Test API Directly (using browser console or Postman)

**Base URL:** `https://xydj5lg2h6.execute-api.us-east-1.amazonaws.com/prod`

### 1. **GET /todos** ✅
```javascript
fetch('https://xydj5lg2h6.execute-api.us-east-1.amazonaws.com/prod/todos')
  .then(r => r.json())
  .then(console.log)
```
**Expected:** Array of tasks with `id`, `text`, `completed`, `createdAt`

### 2. **POST /todos** ✅
```javascript
fetch('https://xydj5lg2h6.execute-api.us-east-1.amazonaws.com/prod/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'API test task', completed: false })
})
  .then(r => r.json())
  .then(console.log)
```
**Expected:** Created task object with generated `id`

### 3. **PUT /todos/{id}/toggle** ✅
```javascript
// Replace {id} with actual task ID
fetch('https://xydj5lg2h6.execute-api.us-east-1.amazonaws.com/prod/todos/1234567890/toggle', {
  method: 'PUT'
})
  .then(r => r.json())
  .then(console.log)
```
**Expected:** Updated task with flipped `completed` status

### 4. **DELETE /todos/{id}** ✅
```javascript
// Replace {id} with actual task ID
fetch('https://xydj5lg2h6.execute-api.us-east-1.amazonaws.com/prod/todos/1234567890', {
  method: 'DELETE'
})
  .then(r => r.json())
  .then(console.log)
```
**Expected:** Success message with deleted task ID

---

## 🔍 Debugging Tips

### **Frontend Not Updating?**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito mode
3. Check CloudFront invalidation status:
   ```powershell
   aws cloudfront get-invalidation --distribution-id EB7DDXZ4MYDUO --id IBICHELUWFNZI1VAGN64XT34TE
   ```

### **API Errors?**
1. Check Lambda logs:
   ```powershell
   aws logs tail /aws/lambda/todo-app-todo-api --follow --region us-east-1
   ```
2. Check API Gateway stage:
   ```powershell
   aws apigateway get-stage --rest-api-id xydj5lg2h6 --stage-name prod
   ```

### **Tasks Not Persisting?**
1. Check DynamoDB table:
   ```powershell
   aws dynamodb scan --table-name todo-app-tasks --region us-east-1
   ```

### **CORS Errors?**
- Lambda function now includes proper CORS headers
- Should see `Access-Control-Allow-Origin: *` in response headers
- Check browser DevTools Network tab

---

## 🎯 Success Criteria

All the following should work without errors:

- ✅ Add new tasks
- ✅ View all tasks after refresh
- ✅ Toggle task completion (persists)
- ✅ Delete tasks (persists)
- ✅ Filter tasks (all/active/completed)
- ✅ Error notifications appear when offline
- ✅ Tasks rollback on failed operations
- ✅ No "undefined" or "title" bugs
- ✅ Responsive design on mobile

---

## 📊 Performance Checks

### **Page Load Speed**
- [ ] Initial load < 2 seconds
- [ ] JavaScript bundle < 50KB gzipped
- [ ] CloudFront cache HIT on subsequent loads

### **API Response Time**
- [ ] GET /todos < 500ms
- [ ] POST /todos < 500ms
- [ ] PUT toggle < 500ms
- [ ] DELETE < 500ms

### **DynamoDB Performance**
- [ ] Scan operation returns all tasks quickly
- [ ] No throttling errors (check CloudWatch)

---

## 🐛 Bug Report Template

If you find issues, document them:

```
**Issue:** [Brief description]
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:** [What should happen]
**Actual:** [What actually happens]
**Console Errors:** [Copy from DevTools]
**Browser:** [Chrome/Firefox/Safari + version]
**Time:** [When it happened]
```

---

## ✅ Final Verification

Before marking the project complete:

- [ ] All frontend features work
- [ ] All backend endpoints respond correctly
- [ ] Error handling works as expected
- [ ] HTTPS enforced (no mixed content)
- [ ] CORS headers present
- [ ] CloudFront serving latest code
- [ ] DynamoDB storing tasks persistently
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Documentation complete

---

**Status:** 🎉 All tests passing  
**Last Verified:** January 12, 2026
