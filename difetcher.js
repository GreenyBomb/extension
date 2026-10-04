(function(Scratch) {
  'use strict';

  const iconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMjguMDI2MDIiIGhlaWdodD0iMTI4LjAyNjAyIiB2aWV3Qm94PSIwLDAsMTI4LjAyNjAyLDEyOC4wMjYwMiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3NS45ODY5OSwtMTE1Ljk4Njk5KSI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj48cGF0aCBkPSJNMTc1Ljk4Njk5LDE4MGMwLC0zNS4zNTM0MSAyOC42NTk2MSwtNjQuMDEzMDEgNjQuMDEzMDEsLTY0LjAxMzAxYzM1LjM1MzQxLDAgNjQuMDEzMDEsMjguNjU5NjEgNjQuMDEzMDEsNjQuMDEzMDFjMCwzNS4zNTM0MSAtMjguNjU5NjEsNjQuMDEzMDEgLTY0LjAxMzAxLDY0LjAxMzAxYy0zNS4zNTM0MSwwIC02NC4wMTMwMSwtMjguNjU5NjEgLTY0LjAxMzAxLC02NC4wMTMwMXoiIGlkPSJkLWd3M29qZDhnIiBmaWxsPSIjNDQyZmI4IiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMTgyLjAzNzgsMTgwYzAsLTMyLjAxMTY0IDI1Ljk1MDU3LC01Ny45NjIyIDU3Ljk2MjIsLTU3Ljk2MjJjMzIuMDExNjQsMCA1Ny45NjIyLDI1Ljk1MDU3IDU3Ljk2MjIsNTcuOTYyMmMwLDMyLjAxMTY0IC0yNS45NTA1Nyw1Ny45NjIyIC01Ny45NjIyLDU3Ljk2MjJjLTMyLjAxMTY0LDAgLTU3Ljk2MjIsLTI1Ljk1MDU3IC01Ny45NjIyLC01Ny45NjIyeiIgaWQ9ImQtdGsweG5ubm8iIGZpbGw9IiM2YjVlYzciIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0xODguNTI3NDgsMTczLjQ3NzY3YzAsLTIuMTQ2OTIgMC4zNTIzNSwtNC4yMTE1NSAxLjAwMjM4LC02LjEzOTJsMzYuODQ4MTMsMTUuNjAzNThjLTIuMDU4NjYsOC4zODY3MiAtOS42MjcxNiw5LjczNzMyIC0xOC42NDg4MSw5LjczNzMyYy0xMC42MDQ3OSwwIC0xOS4yMDE2NywtOC41OTY4OCAtMTkuMjAxNjksLTE5LjIwMTY5eiIgaWQ9ImQtOHl3OGE2czMiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzZiNWVjNyIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI3Mi4yNzA4NSwxOTIuNjYxNTNjLTkuMDIxNjUsMCAtMTYuMjQyMjIsLTIuMDQ2NDYgLTE4LjMwMDksLTEwLjQzMzJsMzYuNTAwMTksLTE0LjkwNzdjMC42NTAwMywxLjkyNzY2IDEuMDAyMzgsMy45OTIyOCAxLjAwMjM4LDYuMTM5MmMwLDEwLjYwNDc5IC04LjU5Njg4LDE5LjIwMTY3IC0xOS4yMDE2NywxOS4yMDE2OXoiIGlkPSJkLWI4Ym9jMHR6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiM2YjVlYzciIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PG1ldGFkYXRhPmRpbW9kLXBhaW50LzEgeyJ2IjoxLCJheGVzIjpbXSwibGlua3MiOltdLCJzd2F0Y2hlcyI6eyJlbnRyaWVzIjpbXSwibG9jayI6ZmFsc2V9LCJzeW1ib2xzIjp7fX08L21ldGFkYXRhPjwvc3ZnPg==";

  class DiInfoExtension {
    constructor() {
      this.cache = {};
    }

    getInfo() {
      return {
        id: 'diinfo',
        name: 'DiFetcher',
        color1: '#6b5ec7',
        color2: '#442fb8',
        menuIconURI: iconURI,
        blocks: [
          {
            opcode: 'getProfileField',
            blockType: Scratch.BlockType.REPORTER,
            text: '[FIELD] of [USERNAME]',
            arguments: {
              FIELD: {
                type: Scratch.ArgumentType.STRING,
                menu: 'fields',
                defaultValue: 'dit_balance'
              },
              USERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'GreenynDoGrau'
              }
            }
          }
        ],
        menus: {
          fields: {
            acceptReporters: true,
            items: [
              { text: 'Username', value: 'username' },
              { text: 'Dits', value: 'dit_balance' },
              { text: 'Followers', value: 'follower_count' },
              { text: 'Following', value: 'following_count' },
              { text: 'Credibility Score', value: 'credibility_score' },
              { text: 'Account Creation Date', value: 'created_at' },
              { text: 'Bio / Description (Clean Text)', value: 'bio' },
              { text: 'Avatar URL', value: 'avatar_url' },
              { text: 'Banner URL', value: 'banner_url' }
            ]
          }
        }
      };
    }

    // Safely removes HTML tags from the bio
    cleanHtml(html) {
      if (!html) return '';
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return (doc.body.textContent || doc.body.innerText || '').trim();
    }

    async fetchUserData(username) {
      const cleanUser = Scratch.Cast.toString(username).trim();
      if (!cleanUser) return null;

      const cacheKey = cleanUser.toLowerCase();
      if (this.cache[cacheKey]) {
        return this.cache[cacheKey];
      }

      const targetUrl = `https://dimod.org/api/users/${encodeURIComponent(cleanUser)}`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

      try {
        const response = await Scratch.fetch(proxyUrl);
        if (!response.ok) throw new Error('Request error via proxy');
        const data = await response.json();
        this.cache[cacheKey] = data;
        return data;
      } catch (e) {
        try {
          const directResponse = await Scratch.fetch(targetUrl);
          const directData = await directResponse.json();
          this.cache[cacheKey] = directData;
          return directData;
        } catch (err) {
          console.error('API Error:', err);
          return null;
        }
      }
    }

    async getProfileField(args) {
      const field = Scratch.Cast.toString(args.FIELD);
      const username = Scratch.Cast.toString(args.USERNAME);
      const data = await this.fetchUserData(username);

      if (!data) return 'Error loading data';

      switch (field) {
        case 'username':
          return data.username || username;

        case 'dit_balance':
          return data.dit_balance ?? 0;

        case 'follower_count':
          return data.follower_count ?? 0;

        case 'following_count':
          return data.following_count ?? 0;

        case 'credibility_score':
          return data.credibility_score ?? 0;

        case 'created_at':
          if (data.created_at) {
            return new Date(data.created_at).toLocaleDateString();
          }
          return 'Unknown';

        case 'bio':
          return this.cleanHtml(data.bio) || 'No bio';

        case 'avatar_url':
          return data.avatar_url || '';

        case 'banner_url':
          return data.banner_url || '';

        default:
          return 'Invalid field';
      }
    }
  }

  Scratch.extensions.register(new DiInfoExtension());
})(Scratch);
