import { getRequest, postRequest } from '@/shared/apiRequests'
import { defineStore } from 'pinia'
import type { User } from "../types/User"

export const useUserStore = defineStore("users", {
  //  actions == data definitions
  state: () => ({
      allUsers: <User[]>[],
      me: <User>{},
  }),
  // getters == computed values
  getters: {
    // getExistingRelationship(id: number)
    // {
    //   return this.me.relationships.filter((rel) => (rel.source_id.id === id || rel.target_id.id === id) &&
    //     (rel.target_id.id === this.me.id || rel.source_id.id === this.me.id))
    // },
  },
  // actions == methods
  actions: {
    async login() {
      const loginData = {
        name: "Renoster",
          password: 'R'
        }
        await postRequest ("login", loginData);
    },

    async initData() {
      await getRequest("users").then(res => {
        this.allUsers = res.data;
      });
    }
  }
})


// export const useTodos = defineStore('todos', {
//   state: () => ({
//     /** @type {{ text: string, id: number, isFinished: boolean }[]} */
//     todos: [],
//     /** @type {'all' | 'finished' | 'unfinished'} */
//     filter: 'all',
//     // type will be automatically inferred to number
//     nextId: 0,
//   }),
//   getters: {
//     finishedTodos(state) {
//       // autocompletion! ✨
//       return state.todos.filter((todo) => todo.isFinished)
//     },
//     unfinishedTodos(state) {
//       return state.todos.filter((todo) => !todo.isFinished)
//     },
//     /**
//      * @returns {{ text: string, id: number, isFinished: boolean }[]}
//      */
//     filteredTodos(state) {
//       if (this.filter === 'finished') {
//         // call other getters with autocompletion ✨
//         return this.finishedTodos
//       } else if (this.filter === 'unfinished') {
//         return this.unfinishedTodos
//       }
//       return this.todos
//     },
//   },
//   actions: {
//     // any amount of arguments, return a promise or not
//     addTodo(text) {
//       // you can directly mutate the state
//       this.todos.push({ text, id: this.nextId++, isFinished: false })
//     },
//   },
// })