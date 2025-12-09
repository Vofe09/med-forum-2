<style jsx>{`
  .container {
    padding: 20px;
    min-height: 100vh;
  }

  h1 { color: var(--blue-dark); }

  .form {
    margin-bottom: 20px;
    padding: 15px;
    background-color: var(--soft-blue);
    border-radius: 10px;
  }

  .form input {
    display: block;
    width: 100%;
    margin: 5px 0;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid var(--blue-light);
  }

  .form button {
    margin-top: 10px;
    padding: 8px 15px;
    background-color: var(--blue-main);
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }

  .form button:hover {
    background-color: var(--blue-dark);
  }

  .categories {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
  }

  .category-card {
    background-color: var(--soft-blue);
    border-left: 5px solid var(--blue-main);
    padding: 15px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }

  .category-card:hover {
    background-color: var(--blue-hover);
    transform: translateY(-3px);
  }

  .card-content h3 {
    margin: 0 0 8px;
    color: var(--blue-dark);
  }

  .card-content p {
    margin: 0;
    color: var(--text-dark);
    font-size: 0.9rem;
  }
`}</style>
