public class Servico {

    private Integer id;
    private String nome;
    private String descricao;
    private float preco;

    public Servico(Integer idInteger, String nomeString, String descricaoString, float precoFloat){
        this.id = idInteger;
        this.nome = nomeString;
        this.descricao = descricaoString;
        this.preco = precoFloat;
    }

    //Getters e setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public float getPreco() {
        return preco;
    }

    public void setPreco(float preco) {
        this.preco = preco;
    }

    

}
