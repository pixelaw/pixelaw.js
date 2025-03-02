# How Interactions (should) work

- user clicks on pixel 
- retrieve function signature
- if just DefaultParams : prep action function -> return
- prep Param objects for each
  - has transformer? (prefix with "crc","crv", "crs")


# Function signature fields
Example from RPS: 
- first_move(crc_move_Move)
- second_move(move)
- finish(crv_move, crs_move)

# Param Transformers
- "crc_VARNAME_VARTYPE": CommitReveal: Commit
  - collect variable value from UI
  - create salt
  - Hash variable with salt
  - submit the hash as felt252
  - store VARNAME+SALT in KVstore for later retrieval 
- "crv_VARNAME": CommitReveal: Value
  - retrieve value of VARNAME from storage
  - submit value
- "crs_VARNAME": CommitReveal: Salt
  - retrieve value of SALT from storage
  - submit value

- ContractCall
- Params
    - StringParam
    - NumberParam
    - EnumParam
    - 

    