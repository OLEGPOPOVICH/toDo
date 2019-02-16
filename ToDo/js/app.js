const toDo = (function () {

    function createElement(tag, props, ...children) {
        const element = document.createElement(tag);
      	Object.keys(props).forEach(key => element[key] = props[key]);
        if (children.length > 0) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    child = document.createTextNode(child);
                }
                element.appendChild(child);
            });
        }
        return element;
    }

    function createTodoItem(title) {
        const checkbox = createElement('input', { type: 'checkbox', className: 'checkbox' });
        const label = createElement('label', { className: 'title' }, title);
        const editInput = createElement('input', { type: 'text', className: 'textfield' });
        const editButton = createElement('button', { className: 'edit' }, 'Изменить');
        const deleteButton = createElement('button', { className: 'delete' }, 'Удалить');
		const listItem = createElement('li', { className: 'todo-item'} , checkbox, label, editInput, editButton, deleteButton);
		
        bindEvents(listItem);

        return listItem;
    }

    function bindEvents(todoItem) {

        const checkbox = todoItem.querySelector('.checkbox');
        const edditButton = todoItem.querySelector('button.edit');
        const deleteButton = todoItem.querySelector('button.delete');

        checkbox.addEventListener('change', toggleTodoItem);
        edditButton.addEventListener('click', editTodoItem);
        deleteButton.addEventListener('click', deleteTodoItem);
	}
	
    function addTodoItem(event) {
		event.preventDefault();

		if(addInput.value.trim() != '') localStorageInit.save();
        if(addInput.value.trim() === '') {
			addInput.value = '';
			return alert('Необходимо ввести название задачи.');
		}
		
		const todoItem = createTodoItem(addInput.value);
        todoList.appendChild(todoItem);
		addInput.value = '';
	}

    function toggleTodoItem() {
        const listItem = this.parentNode;
        listItem.classList.toggle('completed');
    }

    function editTodoItem() {
        const listItem = this.parentNode;
        const title = listItem.querySelector('.title');
        const editInput = listItem.querySelector('.textfield');
        const isEditing = listItem.classList.contains('editing');

        if (isEditing) {
			localStorageInit.replace(title.innerText, editInput.value);
			title.innerText = editInput.value;
            this.innerText = 'Изменить';
        } else {
			editInput.value = title.innerText;
            this.innerText = 'Сохранить';
        }

		listItem.classList.toggle('editing');
	}

    function deleteTodoItem() {
		const listItem = this.parentNode;
		localStorageInit.delete(listItem.children[1].innerText);
		todoList.removeChild(listItem);
	}

    const todoForm = document.getElementById('todo-form');
    const addInput = document.getElementById('add-input');
    const todoList = document.getElementById('todo-list');
    const todoItems = document.querySelectorAll('.todo-item');

    function main() {
		localStorageInit.load();
		todoForm.addEventListener('submit', addTodoItem);
        todoItems.forEach(item => bindEvents(item));
	}

	let localStorageInit = {
		load: function() {
			let values = localStorage.getItem('key');
			if(values !== null) {
				let arrayValues = values.split(",");
				arrayValues.forEach(element => {
					const todoItem = createTodoItem(element.trim());
					todoList.appendChild(todoItem);
				})
			}
		},
		save: function() {
			let values = localStorage.getItem("key");
			if(values !== null) {
				values = values + ", " + addInput.value;
			} else {
				values = addInput.value;
			}
			localStorage.setItem("key", values);	
		},
		replace: function(oldValue, newValue) {
			let values = localStorage.getItem("key").replace(oldValue, newValue);
			localStorage.setItem("key", values);
		},
		delete: function(value) {
			let arrayValues = localStorage.getItem("key").split(",")
			arrayValues.map((elem, i) => {
				if(elem.trim() === value) {
					arrayValues.splice(i, 1);
				}
			})
			if(arrayValues.length) {
				localStorage.setItem("key", arrayValues.toString());
			} else {
				localStorage.removeItem("key");
			}
		}
	}
	
    return main;
})();

toDo();