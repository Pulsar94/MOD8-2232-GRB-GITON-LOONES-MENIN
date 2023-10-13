<template>
  <body>
    <section id="about">
      <h2>About Us</h2>
      <p>Welcome to <strong>BudgetVision</strong>! We are dedicated to providing you with the tools and resources you need to take control of your finances and achieve your financial goals.</p>
    </section>
    <section id="mission">
      <h2>Our Mission</h2>
      <p>At <strong>BudgetVision</strong>, our mission is simple: to empower you with the knowledge and tools to make informed financial decisions. We understand that managing your finances can be challenging, but we're here to make it easier. Whether you're saving for a dream vacation, paying off debt, or simply looking to improve your financial well-being, we've got you covered.</p>
    </section>
    <section id="why">
      <h2>Why Choose Us</h2>
      <ul>
        <li><strong>User-Centric Approach:</strong> We prioritize your needs and strive to create an intuitive and user-friendly platform that simplifies financial management.</li>
        <li><strong>Comprehensive Tools:</strong> From expense tracking to budget management and financial goal setting, our suite of tools covers every aspect of your financial journey.</li>
        <li><strong>Security and Privacy:</strong> We take your data security seriously, employing robust measures to ensure your information is safe and protected.</li>
        <li><strong>Exceptional Support:</strong> Have questions or need assistance? Our dedicated support team is available 24/7 to help you.</li>
      </ul>
    </section>

    <section id="team">
      <h2>Meet Our Team</h2>
      <div class="team-members">
        <div class="team-member">
          <img src="../../assets/img/member1.webp" alt="Team Member 1" />
          <h3>Menin Thibaut</h3>
          <p><a href="https://fr.linkedin.com/in/thibaut-menin-04a70a221/">LinkedIn</a> | <a href="https://github.com/Pulsar94">GitHub</a></p>
        </div>

        <div class="team-member">
          <img src="../../assets/img/member2.webp" alt="Team Member 2" />
          <h3>Giton Mathis</h3>
          <p><a href="https://fr.linkedin.com/in/mathis-giton-77316b233">LinkedIn</a> | <a href="https://github.com/MathisG179">GitHub</a></p>
        </div>

        <div class="team-member">
          <img src="../../assets/img/member3.webp" alt="Team Member 3" />
          <h3>Loones Axel</h3>
          <p><a href="https://fr.linkedin.com/in/axel-loones-7a490321b">LinkedIn</a> | <a href="https://github.com/AxelLns">GitHub</a></p>
        </div>
      </div>
    </section>
  </body>
</template>

<style scoped>
@import url("../../assets/css/variables.css");
body {
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
}

section {
  margin: 15px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

strong {
  color: var(--strong);
}

p {
  font-size: 1.5rem;
  line-height: 1.5;
}

h2 {
  font-size: 2rem;
  margin: 2rem 0 1rem;
  color: var(--about-header);
}

ul {
  font-size: 1.5rem;
  line-height: 1.5;
  list-style: disc;
  margin: 0 0 1rem 2rem;
}

li {
  margin-bottom: 0.5rem;
}

body {
  font-family: Arial, sans-serif;
}

#team {
  padding: 30px;
  text-align: center;
}

.team-members {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.team-member {
  border-radius: 8px;
  overflow: hidden;
  width: 300px;
  margin: 15px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 35px 50px 35px rgba(0, 0, 0, 0.1);
}

.team-member img {
  width: 100%;
  height: auto;
  border-radius: 50%;
}

a {
  color: var(--about-link);
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}

@media screen and (min-width: 768px) {
  .team-members {
    justify-content: space-between;
  }

  .team-member {
    width: 300px;
  }

  .team-member img {
    width: 100%;
  }

  .team-member h3 {
    font-size: 1.5rem;
  }

  .team-member p {
    font-size: 1.25rem;
  }
}
</style>
