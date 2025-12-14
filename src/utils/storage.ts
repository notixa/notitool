interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

interface Todo {
  id: string;
  title: string;
  description?: string;
  category: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
}

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  userId: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  content?: string;
  fileData?: string; // 存储文件的base64数据
  uploadTime: Date;
  userId: string;
  folderId: string | null;
}

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface Website {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
  description?: string;
  position: number;
  createdAt: Date;
  userId: string;
}

class StorageService {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly TODOS_KEY = 'todos';
  private readonly DOCUMENTS_KEY = 'documents';
  private readonly NOTES_KEY = 'notes';
  private readonly FOLDERS_KEY = 'folders';
  private readonly WEBSITES_KEY = 'websites';
  
  private currentUser: User | null = null;

  constructor() {
    this.loadCurrentUser();
  }

  // 用户认证相关方法
  private loadCurrentUser(): void {
    try {
      const user = localStorage.getItem(this.CURRENT_USER_KEY);
      this.currentUser = user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error loading current user:', error);
      this.currentUser = null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  login(username: string, password: string): User | null {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        this.currentUser = user;
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error during login:', error);
      return null;
    }
  }

  register(username: string, email: string, password: string): User | null {
    try {
      const users = this.getUsers();
      if (users.some(u => u.username === username)) {
        return null; // 用户名已存在
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        password,
        createdAt: new Date()
      };
      
      users.push(newUser);
      this.saveUsers(users);
      return newUser;
    } catch (error) {
      console.error('Error during registration:', error);
      return null;
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getUsers(): User[] {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  private getUserDataKey(key: string): string {
    return `${this.currentUser?.id || 'guest'}_${key}`;
  }

  // Todo相关方法
  getTodos(): Todo[] {
    try {
      const todos = localStorage.getItem(this.getUserDataKey(this.TODOS_KEY));
      return todos ? JSON.parse(todos) : [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  }

  getTodosByCategory(category?: string): Todo[] {
    const todos = this.getTodos();
    if (!category || category === '全部') {
      return todos;
    }
    return todos.filter(todo => todo.category === category);
  }

  getTodoCategories(): string[] {
    const todos = this.getTodos();
    const categories = [...new Set(todos.map(todo => todo.category))];
    return categories;
  }

  saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(this.getUserDataKey(this.TODOS_KEY), JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }

  addTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'userId'>): Todo {
    if (!this.currentUser) {
      throw new Error('用户未登录');
    }
    
    const todos = this.getTodos();
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date(),
      userId: this.currentUser.id
    };
    todos.push(newTodo);
    this.saveTodos(todos);
    return newTodo;
  }

  updateTodo(id: string, updates: Partial<Todo>): Todo | null {
    const todos = this.getTodos();
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;
    
    todos[index] = { ...todos[index], ...updates };
    this.saveTodos(todos);
    return todos[index];
  }

  deleteTodo(id: string): boolean {
    const todos = this.getTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    if (filteredTodos.length === todos.length) return false;
    
    this.saveTodos(filteredTodos);
    return true;
  }

  // Document相关方法
  getDocuments(): Document[] {
    try {
      const documents = localStorage.getItem(this.getUserDataKey(this.DOCUMENTS_KEY));
      return documents ? JSON.parse(documents) : [];
    } catch (error) {
      console.error('Error loading documents:', error);
      return [];
    }
  }

  saveDocuments(documents: Document[]): void {
    try {
      localStorage.setItem(this.getUserDataKey(this.DOCUMENTS_KEY), JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving documents:', error);
    }
  }

  addDocument(document: Omit<Document, 'id' | 'uploadTime' | 'userId'>): Document {
    if (!this.currentUser) {
      throw new Error('用户未登录');
    }
    
    const documents = this.getDocuments();
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      uploadTime: new Date(),
      userId: this.currentUser.id,
      folderId: document.folderId || null
    };
    documents.push(newDocument);
    this.saveDocuments(documents);
    return newDocument;
  }

  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const documents = this.getDocuments();
    const index = documents.findIndex(doc => doc.id === id);
    if (index === -1) return null;
    
    documents[index] = { ...documents[index], ...updates };
    this.saveDocuments(documents);
    return documents[index];
  }

  deleteDocument(id: string): boolean {
    const documents = this.getDocuments();
    const filteredDocuments = documents.filter(doc => doc.id !== id);
    if (filteredDocuments.length === documents.length) return false;
    
    this.saveDocuments(filteredDocuments);
    return true;
  }

  // 文件夹相关方法
  getFolders(): Folder[] {
    try {
      const folders = localStorage.getItem(this.getUserDataKey(this.FOLDERS_KEY));
      return folders ? JSON.parse(folders) : [];
    } catch (error) {
      console.error('Error loading folders:', error);
      return [];
    }
  }

  saveFolders(folders: Folder[]): void {
    try {
      localStorage.setItem(this.getUserDataKey(this.FOLDERS_KEY), JSON.stringify(folders));
    } catch (error) {
      console.error('Error saving folders:', error);
    }
  }

  addFolder(name: string, parentId: string | null = null): Folder {
    if (!this.currentUser) {
      throw new Error('用户未登录');
    }
    
    const folders = this.getFolders();
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      parentId,
      createdAt: new Date(),
      userId: this.currentUser.id
    };
    folders.push(newFolder);
    this.saveFolders(folders);
    return newFolder;
  }

  updateFolder(id: string, updates: Partial<Folder>): Folder | null {
    const folders = this.getFolders();
    const index = folders.findIndex(folder => folder.id === id);
    if (index === -1) return null;
    
    folders[index] = { ...folders[index], ...updates };
    this.saveFolders(folders);
    return folders[index];
  }

  deleteFolder(id: string): boolean {
    const folders = this.getFolders();
    const filteredFolders = folders.filter(folder => folder.id !== id && folder.parentId !== id);
    if (filteredFolders.length === folders.length) return false;
    
    // 将该文件夹下的文档移到根目录
    const documents = this.getDocuments();
    const updatedDocuments = documents.map(doc => 
      doc.folderId === id ? { ...doc, folderId: null } : doc
    );
    this.saveDocuments(updatedDocuments);
    
    this.saveFolders(filteredFolders);
    return true;
  }

  getFolderTree(): (Folder & { children: Folder[] })[] {
    const folders = this.getFolders();
    const folderMap = new Map<string, Folder & { children: Folder[] }>();
    
    // 初始化所有文件夹
    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });
    
    // 构建树形结构
    const rootFolders: (Folder & { children: Folder[] })[] = [];
    
    folders.forEach(folder => {
      const folderWithChildren = folderMap.get(folder.id)!;
      if (folder.parentId === null) {
        rootFolders.push(folderWithChildren);
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(folderWithChildren);
        }
      }
    });
    
    return rootFolders;
  }

  getDocumentsByFolder(folderId: string | null): Document[] {
    const documents = this.getDocuments();
    return documents.filter(doc => doc.folderId === folderId);
  }

  moveDocumentToFolder(documentId: string, folderId: string | null): boolean {
    const documents = this.getDocuments();
    const index = documents.findIndex(doc => doc.id === documentId);
    if (index === -1) return false;
    
    documents[index].folderId = folderId;
    this.saveDocuments(documents);
    return true;
  }

  // 笔记相关方法
  getNotes(): Note[] {
    try {
      const notes = localStorage.getItem(this.getUserDataKey(this.NOTES_KEY));
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  getNotesByCategory(category?: string): Note[] {
    const notes = this.getNotes();
    if (!category || category === '全部') {
      return notes;
    }
    return notes.filter(note => note.category === category);
  }

  getNoteCategories(): string[] {
    const notes = this.getNotes();
    const categories = [...new Set(notes.map(note => note.category))];
    return categories;
  }

  saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(this.getUserDataKey(this.NOTES_KEY), JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }

  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Note {
    if (!this.currentUser) {
      throw new Error('用户未登录');
    }
    
    const notes = this.getNotes();
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: this.currentUser.id
    };
    notes.push(newNote);
    this.saveNotes(notes);
    return newNote;
  }

  updateNote(id: string, updates: Partial<Note>): Note | null {
    const notes = this.getNotes();
    const index = notes.findIndex(note => note.id === id);
    if (index === -1) return null;
    
    notes[index] = { 
      ...notes[index], 
      ...updates,
      updatedAt: new Date()
    };
    this.saveNotes(notes);
    return notes[index];
  }

  deleteNote(id: string): boolean {
    const notes = this.getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    if (filteredNotes.length === notes.length) return false;
    
    this.saveNotes(filteredNotes);
    return true;
  }

  // 清空当前用户的所有数据
  clearUserData(): void {
    if (!this.currentUser) return;
    
    localStorage.removeItem(this.getUserDataKey(this.TODOS_KEY));
    localStorage.removeItem(this.getUserDataKey(this.DOCUMENTS_KEY));
    localStorage.removeItem(this.getUserDataKey(this.NOTES_KEY));
    localStorage.removeItem(this.getUserDataKey(this.FOLDERS_KEY));
    localStorage.removeItem(this.getUserDataKey(this.WEBSITES_KEY));
  }

  // 网站相关方法
  getWebsites(): Website[] {
    try {
      const websites = localStorage.getItem(this.getUserDataKey(this.WEBSITES_KEY));
      return websites ? JSON.parse(websites) : [];
    } catch (error) {
      console.error('Error loading websites:', error);
      return [];
    }
  }

  getUserWebsites(userId: string): Website[] {
    try {
      const websites = localStorage.getItem(`${userId}_${this.WEBSITES_KEY}`);
      return websites ? JSON.parse(websites) : [];
    } catch (error) {
      console.error('Error loading user websites:', error);
      return [];
    }
  }

  saveWebsites(websites: Website[]): void {
    try {
      localStorage.setItem(this.getUserDataKey(this.WEBSITES_KEY), JSON.stringify(websites));
    } catch (error) {
      console.error('Error saving websites:', error);
    }
  }

  saveWebsite(website: Website): void {
    const websites = this.getWebsites();
    const existingIndex = websites.findIndex(w => w.id === website.id);
    
    if (existingIndex >= 0) {
      websites[existingIndex] = website;
    } else {
      websites.push(website);
    }
    
    this.saveWebsites(websites);
  }

  updateWebsite(website: Website): void {
    const websites = this.getWebsites();
    const index = websites.findIndex(w => w.id === website.id);
    
    if (index >= 0) {
      websites[index] = website;
      this.saveWebsites(websites);
    }
  }

  deleteWebsite(id: string): boolean {
    const websites = this.getWebsites();
    const filteredWebsites = websites.filter(website => website.id !== id);
    if (filteredWebsites.length === websites.length) return false;
    
    this.saveWebsites(filteredWebsites);
    return true;
  }

  getWebsiteCategories(): string[] {
    const websites = this.getWebsites();
    const categories = [...new Set(websites.map(website => website.category))];
    return categories;
  }

  // 清空所有数据
  clearAll(): void {
    localStorage.removeItem(this.TODOS_KEY);
    localStorage.removeItem(this.DOCUMENTS_KEY);
    localStorage.removeItem(this.NOTES_KEY);
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}

export const storageService = new StorageService();
export type { User, Todo, Document, Note, Folder, Website };